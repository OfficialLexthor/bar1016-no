"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Trash2, Image as ImageIcon, Upload } from "lucide-react"
import { toast } from "sonner"
import type { GalleryImage } from "@/types"

export default function AdminGalleryPage() {
  // TODO: Replace with Supabase queries when connected
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null)

  useEffect(() => {
    setLoading(false)
  }, [])

  function handleUpload() {
    // TODO: Connect to Supabase Storage
    toast.info("Bildeopplasting vil bli koblet til Supabase Storage")
  }

  function confirmDelete(image: GalleryImage) {
    setDeleteTarget(image)
    setDeleteDialogOpen(true)
  }

  function handleDelete() {
    if (!deleteTarget) return
    // TODO: Delete from Supabase Storage + database
    setImages((prev) => prev.filter((i) => i.id !== deleteTarget.id))
    toast.success("Bilde slettet")
    setDeleteDialogOpen(false)
    setDeleteTarget(null)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 bg-white/5" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square bg-white/5 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Galleri</h1>
          <p className="text-gray-400 mt-1">
            Administrer bilder i galleriet
          </p>
        </div>
        <Button onClick={handleUpload} size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Last opp bilde
        </Button>
      </div>

      {images.length === 0 ? (
        <Card className="bg-[#1a1a1a] border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ImageIcon className="h-12 w-12 text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg mb-2">
              Ingen bilder i galleriet enna
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Last opp bilder for aa fylle galleriet.
            </p>
            <Button onClick={handleUpload} size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Last opp forste bilde
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square rounded-lg overflow-hidden bg-[#1a1a1a] border border-white/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.alt ?? "Galleribilde"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => confirmDelete(image)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
              {image.alt && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                  <p className="text-xs text-gray-300 truncate">{image.alt}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Bekreft sletting</DialogTitle>
            <DialogDescription className="text-gray-400">
              Er du sikker paa at du vil slette dette bildet? Denne handlingen
              kan ikke angres.
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
