"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Pencil, Trash2, CalendarDays } from "lucide-react"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils/format"
import { createClient } from "@/lib/supabase/client"
import { createEvent, updateEvent, deleteEvent } from "@/lib/actions/events"
import type { Event } from "@/types"

const EVENT_TYPES = [
  { value: "karaoke", label: "Karaoke" },
  { value: "dj", label: "DJ" },
  { value: "tema", label: "Tema" },
  { value: "annet", label: "Annet" },
] as const

const emptyEvent = {
  title: "",
  description: "",
  event_date: "",
  start_time: "",
  end_time: "",
  event_type: "annet" as Event["event_type"],
  is_published: true,
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [form, setForm] = useState(emptyEvent)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null)

  const fetchData = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false })

    if (data) setEvents(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  function openAdd() {
    setEditingEvent(null)
    setForm(emptyEvent)
    setDialogOpen(true)
  }

  function openEdit(event: Event) {
    setEditingEvent(event)
    setForm({
      title: event.title,
      description: event.description ?? "",
      event_date: event.event_date,
      start_time: event.start_time,
      end_time: event.end_time ?? "",
      event_type: event.event_type,
      is_published: event.is_published,
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.title || !form.event_date || !form.start_time) {
      toast.error("Fyll ut alle påkrevde felt")
      return
    }

    setSaving(true)
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, {
          title: form.title,
          description: form.description || null,
          event_date: form.event_date,
          start_time: form.start_time,
          end_time: form.end_time || null,
          event_type: form.event_type,
          is_published: form.is_published,
        })
        toast.success(`"${form.title}" oppdatert`)
      } else {
        await createEvent({
          title: form.title,
          description: form.description || undefined,
          event_date: form.event_date,
          start_time: form.start_time,
          end_time: form.end_time || undefined,
          event_type: form.event_type,
          is_published: form.is_published,
        })
        toast.success(`"${form.title}" opprettet`)
      }
      setDialogOpen(false)
      await fetchData()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Noe gikk galt"
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  function confirmDelete(event: Event) {
    setDeleteTarget(event)
    setDeleteDialogOpen(true)
  }

  async function handleDelete() {
    if (!deleteTarget) return

    setSaving(true)
    try {
      await deleteEvent(deleteTarget.id)
      toast.success(`"${deleteTarget.title}" slettet`)
      setDeleteDialogOpen(false)
      setDeleteTarget(null)
      await fetchData()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Noe gikk galt"
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  function getEventTypeLabel(type: Event["event_type"]) {
    return EVENT_TYPES.find((t) => t.value === type)?.label ?? type
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Events</h1>
          <p className="text-gray-400 mt-1">Administrer events og arrangementer</p>
        </div>
        <Button onClick={openAdd} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nytt event
        </Button>
      </div>

      {events.length === 0 ? (
        <Card className="bg-[#1a1a1a] border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CalendarDays className="h-12 w-12 text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg mb-2">Ingen events ennå</p>
            <p className="text-gray-500 text-sm mb-4">
              Opprett ditt første event for å komme i gang.
            </p>
            <Button onClick={openAdd} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Opprett event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-[#1a1a1a] border-white/10">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-gray-400">Tittel</TableHead>
                  <TableHead className="text-gray-400">Dato</TableHead>
                  <TableHead className="text-gray-400">Type</TableHead>
                  <TableHead className="text-gray-400">Publisert</TableHead>
                  <TableHead className="text-gray-400 text-right">
                    Handlinger
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow
                    key={event.id}
                    className="border-white/10 hover:bg-white/5"
                  >
                    <TableCell className="text-white font-medium">
                      {event.title}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {formatDate(event.event_date)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-white/20 text-gray-300"
                      >
                        {getEventTypeLabel(event.event_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          event.is_published
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                        }
                      >
                        {event.is_published ? "Ja" : "Nei"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-white"
                          onClick={() => openEdit(event)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-400"
                          onClick={() => confirmDelete(event)}
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

      {/* Add/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Rediger event" : "Nytt event"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingEvent
                ? "Oppdater detaljer for eventet."
                : "Fyll ut skjemaet for å opprette et nytt event."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="event-title" className="text-gray-300">
                Tittel
              </Label>
              <Input
                id="event-title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="F.eks. Karaokekveld"
                className="bg-black/40 border-white/10 text-white"
              />
            </div>

            <div>
              <Label htmlFor="event-desc" className="text-gray-300">
                Beskrivelse
              </Label>
              <Textarea
                id="event-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Beskrivelse av eventet"
                className="bg-black/40 border-white/10 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-date" className="text-gray-300">
                  Dato
                </Label>
                <Input
                  id="event-date"
                  type="date"
                  value={form.event_date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, event_date: e.target.value }))
                  }
                  className="bg-black/40 border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="event-type" className="text-gray-300">
                  Type
                </Label>
                <Select
                  value={form.event_type}
                  onValueChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      event_type: v as Event["event_type"],
                    }))
                  }
                >
                  <SelectTrigger className="bg-black/40 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10">
                    {EVENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-start" className="text-gray-300">
                  Starttid
                </Label>
                <Input
                  id="event-start"
                  type="time"
                  value={form.start_time}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, start_time: e.target.value }))
                  }
                  className="bg-black/40 border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="event-end" className="text-gray-300">
                  Sluttid
                </Label>
                <Input
                  id="event-end"
                  type="time"
                  value={form.end_time}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, end_time: e.target.value }))
                  }
                  className="bg-black/40 border-white/10 text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="event-published"
                checked={form.is_published}
                onChange={(e) =>
                  setForm((f) => ({ ...f, is_published: e.target.checked }))
                }
                className="rounded border-white/20 bg-black/40"
              />
              <Label htmlFor="event-published" className="text-gray-300">
                Publisert
              </Label>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-gray-400">
                Avbryt
              </Button>
            </DialogClose>
            <Button onClick={handleSave} disabled={saving}>
              {saving
                ? "Lagrer..."
                : editingEvent
                  ? "Lagre endringer"
                  : "Opprett"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Bekreft sletting</DialogTitle>
            <DialogDescription className="text-gray-400">
              Er du sikker på at du vil slette &quot;{deleteTarget?.title}
              &quot;? Denne handlingen kan ikke angres.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-gray-400">
                Avbryt
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={saving}
            >
              {saving ? "Sletter..." : "Slett"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
