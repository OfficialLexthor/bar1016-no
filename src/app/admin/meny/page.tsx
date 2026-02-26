"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { formatPrice } from "@/lib/utils/format"
import { createClient } from "@/lib/supabase/client"
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  createMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
} from "@/lib/actions/menu"
import type { MenuItem, MenuCategory, NeonColor } from "@/types"

const NEON_COLORS: NeonColor[] = [
  "cyan",
  "pink",
  "gold",
  "green",
  "orange",
  "red",
  "purple",
]

const emptyItem = {
  name: "",
  category_id: "",
  description: "",
  price: 0,
  is_active: true,
}

const emptyCategory = {
  name: "",
  slug: "",
  neon_color: "cyan" as NeonColor,
  sort_order: 0,
  is_active: true,
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [itemDialogOpen, setItemDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [itemForm, setItemForm] = useState(emptyItem)

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)
  const [categoryForm, setCategoryForm] = useState(emptyCategory)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: "item" | "category"; id: string; name: string } | null>(null)

  const fetchData = useCallback(async () => {
    const supabase = createClient()

    const [catRes, itemRes] = await Promise.all([
      supabase
        .from("menu_categories")
        .select("*")
        .order("sort_order", { ascending: true }),
      supabase
        .from("menu_items")
        .select("*")
        .order("sort_order", { ascending: true }),
    ])

    if (catRes.data) setCategories(catRes.data)
    if (itemRes.data) setItems(itemRes.data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  function getCategoryName(categoryId: string) {
    return categories.find((c) => c.id === categoryId)?.name ?? "Ukjent"
  }

  // Item handlers
  function openAddItem() {
    setEditingItem(null)
    setItemForm(emptyItem)
    setItemDialogOpen(true)
  }

  function openEditItem(item: MenuItem) {
    setEditingItem(item)
    setItemForm({
      name: item.name,
      category_id: item.category_id,
      description: item.description ?? "",
      price: item.price,
      is_active: item.is_active,
    })
    setItemDialogOpen(true)
  }

  async function handleSaveItem() {
    if (!itemForm.name || !itemForm.category_id || itemForm.price <= 0) {
      toast.error("Fyll ut alle påkrevde felt")
      return
    }

    setSaving(true)
    try {
      if (editingItem) {
        await updateMenuItem(editingItem.id, {
          name: itemForm.name,
          category_id: itemForm.category_id,
          description: itemForm.description || null,
          price: itemForm.price,
          is_active: itemForm.is_active,
        })
        toast.success(`"${itemForm.name}" oppdatert`)
      } else {
        await createMenuItem({
          name: itemForm.name,
          category_id: itemForm.category_id,
          description: itemForm.description || undefined,
          price: itemForm.price,
          sort_order: items.length + 1,
        })
        toast.success(`"${itemForm.name}" lagt til`)
      }
      setItemDialogOpen(false)
      await fetchData()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Noe gikk galt"
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  // Category handlers
  function openAddCategory() {
    setEditingCategory(null)
    setCategoryForm({ ...emptyCategory, sort_order: categories.length + 1 })
    setCategoryDialogOpen(true)
  }

  function openEditCategory(category: MenuCategory) {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      neon_color: category.neon_color,
      sort_order: category.sort_order,
      is_active: category.is_active,
    })
    setCategoryDialogOpen(true)
  }

  async function handleSaveCategory() {
    if (!categoryForm.name || !categoryForm.slug) {
      toast.error("Fyll ut alle påkrevde felt")
      return
    }

    setSaving(true)
    try {
      if (editingCategory) {
        await updateMenuCategory(editingCategory.id, {
          name: categoryForm.name,
          slug: categoryForm.slug,
          neon_color: categoryForm.neon_color,
          sort_order: categoryForm.sort_order,
          is_active: categoryForm.is_active,
        })
        toast.success(`"${categoryForm.name}" oppdatert`)
      } else {
        await createMenuCategory({
          name: categoryForm.name,
          slug: categoryForm.slug,
          neon_color: categoryForm.neon_color,
          sort_order: categoryForm.sort_order,
        })
        toast.success(`"${categoryForm.name}" lagt til`)
      }
      setCategoryDialogOpen(false)
      await fetchData()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Noe gikk galt"
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  // Delete handlers
  function confirmDelete(type: "item" | "category", id: string, name: string) {
    setDeleteTarget({ type, id, name })
    setDeleteDialogOpen(true)
  }

  async function handleDelete() {
    if (!deleteTarget) return

    setSaving(true)
    try {
      if (deleteTarget.type === "item") {
        await deleteMenuItem(deleteTarget.id)
        toast.success(`"${deleteTarget.name}" slettet`)
      } else {
        await deleteMenuCategory(deleteTarget.id)
        toast.success(`"${deleteTarget.name}" slettet`)
      }
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
      <div>
        <h1 className="text-3xl font-bold text-white">Meny</h1>
        <p className="text-gray-400 mt-1">Administrer menyen til 1016</p>
      </div>

      <Tabs defaultValue="items">
        <TabsList className="bg-[#1a1a1a] border border-white/10">
          <TabsTrigger value="items">Items ({items.length})</TabsTrigger>
          <TabsTrigger value="categories">
            Kategorier ({categories.length})
          </TabsTrigger>
        </TabsList>

        {/* Items tab */}
        <TabsContent value="items" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openAddItem} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Legg til item
            </Button>
          </div>

          <Card className="bg-[#1a1a1a] border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-gray-400">Navn</TableHead>
                    <TableHead className="text-gray-400">Kategori</TableHead>
                    <TableHead className="text-gray-400">Pris</TableHead>
                    <TableHead className="text-gray-400">Aktiv</TableHead>
                    <TableHead className="text-gray-400 text-right">
                      Handlinger
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-white/10 hover:bg-white/5"
                    >
                      <TableCell className="text-white font-medium">
                        {item.name}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {getCategoryName(item.category_id)}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {formatPrice(item.price)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={item.is_active ? "default" : "secondary"}
                          className={
                            item.is_active
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                          }
                        >
                          {item.is_active ? "Aktiv" : "Inaktiv"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-white"
                            onClick={() => openEditItem(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-red-400"
                            onClick={() =>
                              confirmDelete("item", item.id, item.name)
                            }
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
        </TabsContent>

        {/* Categories tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openAddCategory} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Legg til kategori
            </Button>
          </div>

          <Card className="bg-[#1a1a1a] border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-gray-400">Navn</TableHead>
                    <TableHead className="text-gray-400">Slug</TableHead>
                    <TableHead className="text-gray-400">Farge</TableHead>
                    <TableHead className="text-gray-400">Rekkefølge</TableHead>
                    <TableHead className="text-gray-400">Aktiv</TableHead>
                    <TableHead className="text-gray-400 text-right">
                      Handlinger
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((cat) => (
                    <TableRow
                      key={cat.id}
                      className="border-white/10 hover:bg-white/5"
                    >
                      <TableCell className="text-white font-medium">
                        {cat.name}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {cat.slug}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className="capitalize"
                          style={{
                            backgroundColor: `var(--color-neon-${cat.neon_color}, #666)`,
                            color: "#000",
                          }}
                        >
                          {cat.neon_color}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {cat.sort_order}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={cat.is_active ? "default" : "secondary"}
                          className={
                            cat.is_active
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                          }
                        >
                          {cat.is_active ? "Aktiv" : "Inaktiv"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-white"
                            onClick={() => openEditCategory(cat)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-red-400"
                            onClick={() =>
                              confirmDelete("category", cat.id, cat.name)
                            }
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
        </TabsContent>
      </Tabs>

      {/* Item dialog */}
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Rediger item" : "Legg til item"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingItem
                ? "Oppdater detaljer for menyitemet."
                : "Fyll ut skjemaet for å legge til et nytt menyitem."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="item-name" className="text-gray-300">
                Navn
              </Label>
              <Input
                id="item-name"
                value={itemForm.name}
                onChange={(e) =>
                  setItemForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="F.eks. Mojito"
                className="bg-black/40 border-white/10 text-white"
              />
            </div>

            <div>
              <Label htmlFor="item-category" className="text-gray-300">
                Kategori
              </Label>
              <Select
                value={itemForm.category_id}
                onValueChange={(v) =>
                  setItemForm((f) => ({ ...f, category_id: v }))
                }
              >
                <SelectTrigger className="bg-black/40 border-white/10 text-white">
                  <SelectValue placeholder="Velg kategori" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="item-desc" className="text-gray-300">
                Beskrivelse
              </Label>
              <Textarea
                id="item-desc"
                value={itemForm.description}
                onChange={(e) =>
                  setItemForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Ingredienser eller kort beskrivelse"
                className="bg-black/40 border-white/10 text-white"
              />
            </div>

            <div>
              <Label htmlFor="item-price" className="text-gray-300">
                Pris (NOK)
              </Label>
              <Input
                id="item-price"
                type="number"
                value={itemForm.price || ""}
                onChange={(e) =>
                  setItemForm((f) => ({
                    ...f,
                    price: parseInt(e.target.value) || 0,
                  }))
                }
                placeholder="0"
                className="bg-black/40 border-white/10 text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="item-active"
                checked={itemForm.is_active}
                onChange={(e) =>
                  setItemForm((f) => ({ ...f, is_active: e.target.checked }))
                }
                className="rounded border-white/20 bg-black/40"
              />
              <Label htmlFor="item-active" className="text-gray-300">
                Aktiv (synlig på menyen)
              </Label>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-gray-400">
                Avbryt
              </Button>
            </DialogClose>
            <Button onClick={handleSaveItem} disabled={saving}>
              {saving
                ? "Lagrer..."
                : editingItem
                  ? "Lagre endringer"
                  : "Legg til"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Rediger kategori" : "Legg til kategori"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingCategory
                ? "Oppdater detaljer for kategorien."
                : "Fyll ut skjemaet for å opprette en ny kategori."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="cat-name" className="text-gray-300">
                Navn
              </Label>
              <Input
                id="cat-name"
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="F.eks. Cocktails"
                className="bg-black/40 border-white/10 text-white"
              />
            </div>

            <div>
              <Label htmlFor="cat-slug" className="text-gray-300">
                Slug
              </Label>
              <Input
                id="cat-slug"
                value={categoryForm.slug}
                onChange={(e) =>
                  setCategoryForm((f) => ({ ...f, slug: e.target.value }))
                }
                placeholder="F.eks. cocktails"
                className="bg-black/40 border-white/10 text-white"
              />
            </div>

            <div>
              <Label htmlFor="cat-color" className="text-gray-300">
                Neon-farge
              </Label>
              <Select
                value={categoryForm.neon_color}
                onValueChange={(v) =>
                  setCategoryForm((f) => ({
                    ...f,
                    neon_color: v as NeonColor,
                  }))
                }
              >
                <SelectTrigger className="bg-black/40 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  {NEON_COLORS.map((color) => (
                    <SelectItem key={color} value={color} className="capitalize">
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cat-order" className="text-gray-300">
                Rekkefølge
              </Label>
              <Input
                id="cat-order"
                type="number"
                value={categoryForm.sort_order || ""}
                onChange={(e) =>
                  setCategoryForm((f) => ({
                    ...f,
                    sort_order: parseInt(e.target.value) || 0,
                  }))
                }
                className="bg-black/40 border-white/10 text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="cat-active"
                checked={categoryForm.is_active}
                onChange={(e) =>
                  setCategoryForm((f) => ({
                    ...f,
                    is_active: e.target.checked,
                  }))
                }
                className="rounded border-white/20 bg-black/40"
              />
              <Label htmlFor="cat-active" className="text-gray-300">
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
            <Button onClick={handleSaveCategory} disabled={saving}>
              {saving
                ? "Lagrer..."
                : editingCategory
                  ? "Lagre endringer"
                  : "Legg til"}
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
              Er du sikker på at du vil slette &quot;{deleteTarget?.name}&quot;?
              Denne handlingen kan ikke angres.
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
