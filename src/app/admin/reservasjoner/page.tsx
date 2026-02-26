"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Check, X, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { formatDate, formatTime } from "@/lib/utils/format"
import { cn } from "@/lib/utils"
import type { Reservation } from "@/types"

const statusConfig = {
  pending: {
    label: "Ventende",
    className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  confirmed: {
    label: "Bekreftet",
    className: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  cancelled: {
    label: "Avvist",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
} as const

export default function AdminReservationsPage() {
  // TODO: Replace with Supabase queries when connected
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("alle")

  const [notesDialogOpen, setNotesDialogOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [adminNotes, setAdminNotes] = useState("")

  useEffect(() => {
    setLoading(false)
  }, [])

  function handleConfirm(reservation: Reservation) {
    // TODO: Update via Supabase
    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservation.id ? { ...r, status: "confirmed" as const } : r
      )
    )
    toast.success(`Reservasjon fra ${reservation.name} bekreftet`)
  }

  function handleCancel(reservation: Reservation) {
    // TODO: Update via Supabase
    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservation.id ? { ...r, status: "cancelled" as const } : r
      )
    )
    toast.success(`Reservasjon fra ${reservation.name} avvist`)
  }

  function openNotes(reservation: Reservation) {
    setSelectedReservation(reservation)
    setAdminNotes(reservation.admin_notes ?? "")
    setNotesDialogOpen(true)
  }

  function handleSaveNotes() {
    if (!selectedReservation) return
    // TODO: Update via Supabase
    setReservations((prev) =>
      prev.map((r) =>
        r.id === selectedReservation.id
          ? { ...r, admin_notes: adminNotes || null }
          : r
      )
    )
    toast.success("Notater lagret")
    setNotesDialogOpen(false)
  }

  const filteredReservations =
    activeTab === "alle"
      ? reservations
      : reservations.filter((r) => r.status === activeTab)

  const pendingCount = reservations.filter(
    (r) => r.status === "pending"
  ).length
  const confirmedCount = reservations.filter(
    (r) => r.status === "confirmed"
  ).length
  const cancelledCount = reservations.filter(
    (r) => r.status === "cancelled"
  ).length

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 bg-white/5" />
        <Skeleton className="h-64 w-full bg-white/5" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Reservasjoner</h1>
        <p className="text-gray-400 mt-1">
          Behandle og administrer bordreservasjoner
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="bg-[#1a1a1a] border border-white/10">
          <TabsTrigger value="alle">
            Alle ({reservations.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Ventende ({pendingCount})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Bekreftet ({confirmedCount})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Avvist ({cancelledCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredReservations.length === 0 ? (
            <Card className="bg-[#1a1a1a] border-white/10">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <BookOpen className="h-12 w-12 text-gray-600 mb-4" />
                <p className="text-gray-400 text-lg mb-2">
                  Ingen reservasjoner
                </p>
                <p className="text-gray-500 text-sm">
                  {activeTab === "alle"
                    ? "Det er ingen reservasjoner ennå."
                    : `Ingen ${statusConfig[activeTab as keyof typeof statusConfig]?.label.toLowerCase() ?? ""} reservasjoner.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-[#1a1a1a] border-white/10">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-gray-400">Navn</TableHead>
                      <TableHead className="text-gray-400">Dato</TableHead>
                      <TableHead className="text-gray-400">Tid</TableHead>
                      <TableHead className="text-gray-400">Gjester</TableHead>
                      <TableHead className="text-gray-400">Type</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400 text-right">
                        Handlinger
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReservations.map((reservation) => (
                      <TableRow
                        key={reservation.id}
                        className="border-white/10 hover:bg-white/5"
                      >
                        <TableCell className="text-white font-medium">
                          <div>
                            {reservation.name}
                            <p className="text-xs text-gray-500">
                              {reservation.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {formatDate(reservation.date)}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {formatTime(reservation.time)}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {reservation.guests}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="border-white/20 text-gray-300 capitalize"
                          >
                            {reservation.reservation_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              statusConfig[reservation.status].className
                            }
                          >
                            {statusConfig[reservation.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {reservation.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                                  onClick={() => handleConfirm(reservation)}
                                  title="Bekreft"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                  onClick={() => handleCancel(reservation)}
                                  title="Avvis"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "h-8 w-8",
                                reservation.admin_notes
                                  ? "text-neon-cyan hover:text-neon-cyan/80"
                                  : "text-gray-400 hover:text-white"
                              )}
                              onClick={() => openNotes(reservation)}
                              title="Admin-notater"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Admin notes dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Admin-notater</DialogTitle>
            <DialogDescription className="text-gray-400">
              Interne notater for reservasjonen fra{" "}
              {selectedReservation?.name}.
            </DialogDescription>
          </DialogHeader>

          <div>
            <Label htmlFor="admin-notes" className="text-gray-300">
              Notater
            </Label>
            <Textarea
              id="admin-notes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Skriv interne notater her..."
              rows={4}
              className="bg-black/40 border-white/10 text-white"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-gray-400">
                Avbryt
              </Button>
            </DialogClose>
            <Button onClick={handleSaveNotes}>Lagre notater</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
