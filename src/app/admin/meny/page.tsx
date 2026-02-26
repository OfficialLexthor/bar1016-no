"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
  DialogTrigger,
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

// Placeholder data matching the bar menu
const placeholderCategories: MenuCategory[] = [
  { id: "1", name: "Cocktails", slug: "cocktails", sort_order: 1, neon_color: "cyan", is_active: true, created_at: "", updated_at: "" },
  { id: "2", name: "Shots", slug: "shots", sort_order: 2, neon_color: "pink", is_active: true, created_at: "", updated_at: "" },
  { id: "3", name: "Ol", slug: "ol", sort_order: 3, neon_color: "gold", is_active: true, created_at: "", updated_at: "" },
  { id: "4", name: "Vin", slug: "vin", sort_order: 4, neon_color: "red", is_active: true, created_at: "", updated_at: "" },
  { id: "5", name: "Alkoholfritt", slug: "alkoholfritt", sort_order: 5, neon_color: "green", is_active: true, created_at: "", updated_at: "" },
]

const placeholderItems: MenuItem[] = [
  { id: "1", category_id: "1", name: "Espresso Martini", description: "Vodka, kaffe, kaffelikoer", price: 179, is_active: true, sort_order: 1, created_at: "", updated_at: "" },
  { id: "2", category_id: "1", name: "Aperol Spritz", description: "Aperol, prosecco, sodavann", price: 169, is_active: true, sort_order: 2, created_at: "", updated_at: "" },
  { id: "3", category_id: "1", name: "Mojito", description: "Rom, lime, mynte, sukker, sodavann", price: 169, is_active: true, sort_order: 3, created_at: "", updated_at: "" },
  { id: "4", category_id: "1", name: "Margarita", description: "Tequila, cointreau, lime", price: 179, is_active: true, sort_order: 4, created_at: "", updated_at: "" },
  { id: "5", category_id: "2", name: "Jagermeister", description: null, price: 99, is_active: true, sort_order: 1, created_at: "", updated_at: "" },
  { id: "6", category_id: "2", name: "Fernet Branca", description: null, price: 99, is_active: true, sort_order: 2, created_at: "", updated_at: "" },
  { id: "7", category_id: "3", name: "Hansa Fatol", description: "0.5L", price: 99, is_active: true, sort_order: 1, created_at: "", updated_at: "" },
  { id: "8", category_id: "3", name: "Tuborg", description: "0.5L", price: 99, is_active: true, sort_order: 2, created_at: "", updated_at: "" },
  { id: "9", category_id: "4", name: "Husets rod", description: "Glass", price: 129, is_active: true, sort_order: 1, created_at: "", updated_at: "" },
  { id: "10", category_id: "4", name: "Husets hvit", description: "Glass", price: 129, is_active: true, sort_order: 2, created_at: "", updated_at: "" },
  { id: "11", category_id: "5", name: "Pepsi", description: "0.33L", price: 59, is_active: true, sort_order: 1, created_at: "", updated_at: "" },
  { id: "12", category_id: "5", name: "Munkholm", description: "0.33L", price: 79, is_active: true, sort_order: 2, created_at: "", updated_at: "" },
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
  // TODO: Replace with Supabase queries when connected
  const [items, setItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)

  const [itemDialogOpen, setItemDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [itemForm, setItemForm] = useState(emptyItem)

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)
  const [categoryForm, setCategoryForm] = useState(emptyCategory)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: "item" | "category"; id: string; name: string } | null>(null)

  useEffect(() => {
    setItems(placeholderItems)
    setCategories(placeholderCategories)
    setLoading(false)
  }, [])

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

  function handleSaveItem() {
    if (!itemForm.name || !itemForm.category_id || itemForm.price <= 0) {
      toast.error("Fyll ut alle paakrevde felt")
      return
    }

    if (editingItem) {
      // TODO: Update via Supabase
      setItems((prev) =>
        prev.map((i) =>
          i.id === editingItem.id
            ? {
                ...i,
                name: itemForm.name,
                category_id: itemForm.category_id,
                description: itemForm.description || null,
                price: itemForm.price,
                is_active: itemForm.is_active,
              }
            : i
        )
      )
      toast.success(`"${itemForm.name}" oppdatert`)
    } else {
      // TODO: Insert via Supabase
      const newItem: MenuItem = {
        id: crypto.randomUUID(),
        category_id: itemForm.category_id,
        name: itemForm.name,
        description: itemForm.description || null,
        price: itemForm.price,
        is_active: itemForm.is_active,
        sort_order: items.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setItems((prev) => [...prev, newItem])
      toast.success(`"${itemForm.name}" lagt til`)
    }

    setItemDialogOpen(false)
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

  function handleSaveCategory() {
    if (!categoryForm.name || !categoryForm.slug) {
      toast.error("Fyll ut alle paakrevde felt")
      return
    }

    if (editingCategory) {
      // TODO: Update via Supabase
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                name: categoryForm.name,
                slug: categoryForm.slug,
                neon_color: categoryForm.neon_color,
                sort_order: categoryForm.sort_order,
                is_active: categoryForm.is_active,
              }
            : c
        )
      )
      toast.success(`"${categoryForm.name}" oppdatert`)
    } else {
      // TODO: Insert via Supabase
      const newCategory: MenuCategory = {
        id: crypto.randomUUID(),
        name: categoryForm.name,
        slug: categoryForm.slug,
        neon_color: categoryForm.neon_color,
        sort_order: categoryForm.sort_order,
        is_active: categoryForm.is_active,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setCategories((prev) => [...prev, newCategory])
      toast.success(`"${categoryForm.name}" lagt til`)
    }

    setCategoryDialogOpen(false)
  }

  // Delete handlers
  function confirmDelete(type: "item" | "category", id: string, name: string) {
    setDeleteTarget({ type, id, name })
    setDeleteDialogOpen(true)
  }

  function handleDelete() {
    if (!deleteTarget) return

    if (deleteTarget.type === "item") {
      // TODO: Delete via Supabase
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id))
      toast.success(`"${deleteTarget.name}" slettet`)
    } else {
      // TODO: Delete via Supabase
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id))
      toast.success(`"${deleteTarget.name}" slettet`)
    }

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
      <div>
        <h1 className="text-3xl font-bold text-white">Meny</h1>
        <p className="text-gray-400 mt-1">Administrer menyen til 1016 Bar</p>
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
                    <TableHead className="text-gray-400">Rekkefolge</TableHead>
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
                            backgroundColor: `var(--neon-${cat.neon_color}, #666)`,
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
                : "Fyll ut skjemaet for aa legge til et nytt menyitem."}
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
                placeholder="F.eks. Espresso Martini"
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
                placeholder="Kort beskrivelse av itemet"
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
                Aktiv (synlig paa menyen)
              </Label>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-gray-400">
                Avbryt
              </Button>
            </DialogClose>
            <Button onClick={handleSaveItem}>
              {editingItem ? "Lagre endringer" : "Legg til"}
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
                : "Fyll ut skjemaet for aa opprette en ny kategori."}
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
                Rekkefolge
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
            <Button onClick={handleSaveCategory}>
              {editingCategory ? "Lagre endringer" : "Legg til"}
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
              Er du sikker paa at du vil slette &quot;{deleteTarget?.name}&quot;?
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
            >
              Slett
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
