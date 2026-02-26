"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Skeleton } from "@/components/ui/skeleton"
import { MessageSquare, Mail, MailOpen, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils/format"
import { cn } from "@/lib/utils"
import type { ContactMessage } from "@/types"

export default function AdminMessagesPage() {
  // TODO: Replace with Supabase queries when connected
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null)

  useEffect(() => {
    setLoading(false)
  }, [])

  const unreadCount = messages.filter((m) => !m.is_read).length

  function viewMessage(message: ContactMessage) {
    setSelectedMessage(message)
    setViewDialogOpen(true)

    // Auto-mark as read when opening
    if (!message.is_read) {
      markAsRead(message.id)
    }
  }

  function markAsRead(id: string) {
    // TODO: Update via Supabase
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: true } : m))
    )
  }

  function toggleRead(message: ContactMessage) {
    // TODO: Update via Supabase
    setMessages((prev) =>
      prev.map((m) =>
        m.id === message.id ? { ...m, is_read: !m.is_read } : m
      )
    )
    toast.success(
      message.is_read ? "Merket som ulest" : "Merket som lest"
    )
  }

  function confirmDelete(message: ContactMessage) {
    setDeleteTarget(message)
    setDeleteDialogOpen(true)
  }

  function handleDelete() {
    if (!deleteTarget) return
    // TODO: Delete via Supabase
    setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id))
    toast.success("Melding slettet")
    setDeleteDialogOpen(false)
    setDeleteTarget(null)
  }

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
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">Meldinger</h1>
          <p className="text-gray-400 mt-1">
            Kontaktmeldinger fra besokende
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge className="bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20">
            {unreadCount} ulest{unreadCount > 1 ? "e" : ""}
          </Badge>
        )}
      </div>

      {messages.length === 0 ? (
        <Card className="bg-[#1a1a1a] border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MessageSquare className="h-12 w-12 text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg mb-2">
              Ingen meldinger ennå
            </p>
            <p className="text-gray-500 text-sm">
              Meldinger fra kontaktskjemaet vil vises her.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-[#1a1a1a] border-white/10">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-gray-400 w-8" />
                  <TableHead className="text-gray-400">Navn</TableHead>
                  <TableHead className="text-gray-400">Emne</TableHead>
                  <TableHead className="text-gray-400">Dato</TableHead>
                  <TableHead className="text-gray-400">Lest</TableHead>
                  <TableHead className="text-gray-400 text-right">
                    Handlinger
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow
                    key={message.id}
                    className={cn(
                      "border-white/10 cursor-pointer transition-colors",
                      message.is_read
                        ? "hover:bg-white/5"
                        : "bg-white/[0.02] hover:bg-white/5"
                    )}
                    onClick={() => viewMessage(message)}
                  >
                    <TableCell className="w-8">
                      {message.is_read ? (
                        <MailOpen className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Mail className="h-4 w-4 text-neon-cyan" />
                      )}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "font-medium",
                        message.is_read ? "text-gray-400" : "text-white"
                      )}
                    >
                      <div>
                        {message.name}
                        <p className="text-xs text-gray-500">
                          {message.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell
                      className={cn(
                        message.is_read ? "text-gray-400" : "text-gray-200"
                      )}
                    >
                      {message.subject}
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {formatDate(message.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          message.is_read
                            ? "bg-gray-500/10 text-gray-400 border-gray-500/20"
                            : "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20"
                        }
                      >
                        {message.is_read ? "Lest" : "Ulest"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div
                        className="flex justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-white"
                          onClick={() => toggleRead(message)}
                          title={
                            message.is_read
                              ? "Merk som ulest"
                              : "Merk som lest"
                          }
                        >
                          {message.is_read ? (
                            <Mail className="h-4 w-4" />
                          ) : (
                            <MailOpen className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-400"
                          onClick={() => confirmDelete(message)}
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* View message dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Fra {selectedMessage?.name} ({selectedMessage?.email})
              {selectedMessage?.phone && ` - ${selectedMessage.phone}`}
              <br />
              {selectedMessage?.created_at &&
                formatDate(selectedMessage.created_at)}
            </DialogDescription>
          </DialogHeader>

          <div className="bg-black/30 rounded-lg p-4 border border-white/5">
            <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
              {selectedMessage?.message}
            </p>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-gray-400">
                Lukk
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Bekreft sletting</DialogTitle>
            <DialogDescription className="text-gray-400">
              Er du sikker på at du vil slette denne meldingen fra{" "}
              {deleteTarget?.name}? Denne handlingen kan ikke angres.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-gray-400">
                Avbryt
              </Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              Slett
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
