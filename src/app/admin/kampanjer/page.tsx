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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Pencil, Trash2, Megaphone } from "lucide-react"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils/format"
import { createClient } from "@/lib/supabase/client"
import {
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from "@/lib/actions/campaigns"
import type { Campaign } from "@/types"

const emptyCampaign = {
  title: "",
  description: "",
  start_date: "",
  end_date: "",
  is_active: true,
}

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [form, setForm] = useState(emptyCampaign)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null)

  const fetchData = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) setCampaigns(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  function openAdd() {
    setEditingCampaign(null)
    setForm(emptyCampaign)
    setDialogOpen(true)
  }

  function openEdit(campaign: Campaign) {
    setEditingCampaign(campaign)
    setForm({
      title: campaign.title,
      description: campaign.description ?? "",
      start_date: campaign.start_date,
      end_date: campaign.end_date,
      is_active: campaign.is_active,
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.title || !form.start_date || !form.end_date) {
      toast.error("Fyll ut alle pakrevde felt")
      return
    }

    setSaving(true)
    try {
      if (editingCampaign) {
        await updateCampaign(editingCampaign.id, {
          title: form.title,
          description: form.description || null,
          start_date: form.start_date,
          end_date: form.end_date,
          is_active: form.is_active,
        })
        toast.success(`"${form.title}" oppdatert`)
      } else {
        await createCampaign({
          title: form.title,
          description: form.description || undefined,
          start_date: form.start_date,
          end_date: form.end_date,
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

  function confirmDelete(campaign: Campaign) {
    setDeleteTarget(campaign)
    setDeleteDialogOpen(true)
  }

  async function handleDelete() {
    if (!deleteTarget) return

    setSaving(true)
    try {
      await deleteCampaign(deleteTarget.id)
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
          <h1 className="text-3xl font-bold text-white">Kampanjer</h1>
          <p className="text-gray-400 mt-1">
            Administrer kampanjer og tilbud
          </p>
        </div>
        <Button onClick={openAdd} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ny kampanje
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <Card className="bg-[#1a1a1a] border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Megaphone className="h-12 w-12 text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg mb-2">
              Ingen kampanjer ennå
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Opprett din forste kampanje for å komme i gang.
            </p>
            <Button onClick={openAdd} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Opprett kampanje
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
                  <TableHead className="text-gray-400">Startdato</TableHead>
                  <TableHead className="text-gray-400">Sluttdato</TableHead>
                  <TableHead className="text-gray-400">Aktiv</TableHead>
                  <TableHead className="text-gray-400 text-right">
                    Handlinger
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow
                    key={campaign.id}
                    className="border-white/10 hover:bg-white/5"
                  >
                    <TableCell className="text-white font-medium">
                      {campaign.title}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {formatDate(campaign.start_date)}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {formatDate(campaign.end_date)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          campaign.is_active
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                        }
                      >
                        {campaign.is_active ? "Aktiv" : "Inaktiv"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-white"
                          onClick={() => openEdit(campaign)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-400"
                          onClick={() => confirmDelete(campaign)}
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
              {editingCampaign ? "Rediger kampanje" : "Ny kampanje"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingCampaign
                ? "Oppdater detaljer for kampanjen."
                : "Fyll ut skjemaet for å opprette en ny kampanje."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="campaign-title" className="text-gray-300">
                Tittel
              </Label>
              <Input
                id="campaign-title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="F.eks. Happy Hour"
                className="bg-black/40 border-white/10 text-white"
              />
            </div>

            <div>
              <Label htmlFor="campaign-desc" className="text-gray-300">
                Beskrivelse
              </Label>
              <Textarea
                id="campaign-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Beskrivelse av kampanjen"
                className="bg-black/40 border-white/10 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="campaign-start" className="text-gray-300">
                  Startdato
                </Label>
                <Input
                  id="campaign-start"
                  type="date"
                  value={form.start_date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, start_date: e.target.value }))
                  }
                  className="bg-black/40 border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="campaign-end" className="text-gray-300">
                  Sluttdato
                </Label>
                <Input
                  id="campaign-end"
                  type="date"
                  value={form.end_date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, end_date: e.target.value }))
                  }
                  className="bg-black/40 border-white/10 text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="campaign-active"
                checked={form.is_active}
                onChange={(e) =>
                  setForm((f) => ({ ...f, is_active: e.target.checked }))
                }
                className="rounded border-white/20 bg-black/40"
              />
              <Label htmlFor="campaign-active" className="text-gray-300">
                Aktiv
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
                : editingCampaign
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
