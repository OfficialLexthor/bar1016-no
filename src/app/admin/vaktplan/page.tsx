"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
  Copy,
  RefreshCw,
} from "lucide-react"
import { toast } from "sonner"
import { formatTime } from "@/lib/utils/format"
import { getNeonColor } from "@/lib/utils/neon-colors"
import {
  getMonday,
  addDays,
  toISODate,
  getWeekDays,
  formatWeekLabel,
} from "@/lib/utils/week"
import { createClient } from "@/lib/supabase/client"
import {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  regenerateEmployeeToken,
  createShift,
  updateShift,
  deleteShift,
} from "@/lib/actions/shifts"
import type { Employee, ShiftWithEmployee, NeonColor } from "@/types"

const NEON_COLORS: { value: NeonColor; label: string }[] = [
  { value: "cyan", label: "Cyan" },
  { value: "pink", label: "Rosa" },
  { value: "gold", label: "Gull" },
  { value: "green", label: "Grønn" },
  { value: "orange", label: "Oransje" },
  { value: "red", label: "Rød" },
  { value: "purple", label: "Lilla" },
]

const DAY_NAMES = [
  "Mandag",
  "Tirsdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lørdag",
  "Søndag",
]

const emptyShiftForm = {
  employee_id: "",
  shift_date: "",
  start_time: "",
  end_time: "",
  role: "",
  note: "",
}

const emptyEmployeeForm = {
  name: "",
  neon_color: "cyan" as NeonColor,
  is_active: true,
}

export default function AdminVaktplanPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [shifts, setShifts] = useState<ShiftWithEmployee[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()))

  const [shiftDialogOpen, setShiftDialogOpen] = useState(false)
  const [editingShift, setEditingShift] = useState<ShiftWithEmployee | null>(null)
  const [shiftForm, setShiftForm] = useState(emptyShiftForm)

  const [deleteShiftDialogOpen, setDeleteShiftDialogOpen] = useState(false)
  const [deleteShiftTarget, setDeleteShiftTarget] =
    useState<ShiftWithEmployee | null>(null)

  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [employeeForm, setEmployeeForm] = useState(emptyEmployeeForm)

  const [deleteEmployeeDialogOpen, setDeleteEmployeeDialogOpen] = useState(false)
  const [deleteEmployeeTarget, setDeleteEmployeeTarget] =
    useState<Employee | null>(null)

  const [regenDialogOpen, setRegenDialogOpen] = useState(false)
  const [regenTarget, setRegenTarget] = useState<Employee | null>(null)

  const fetchEmployees = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("employees")
      .select("*")
      .order("name", { ascending: true })

    if (data) setEmployees(data)
  }, [])

  const fetchShifts = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("shifts")
      .select("*, employees(id, name, neon_color)")
      .gte("shift_date", toISODate(weekStart))
      .lte("shift_date", toISODate(addDays(weekStart, 6)))
      .order("shift_date", { ascending: true })
      .order("start_time", { ascending: true })

    if (data) setShifts(data)
  }, [weekStart])

  useEffect(() => {
    fetchEmployees().then(() => setLoading(false))
  }, [fetchEmployees])

  useEffect(() => {
    fetchShifts()
  }, [fetchShifts])

  const activeEmployees = employees.filter((e) => e.is_active)
  const todayISO = toISODate(new Date())
  const weekDays = getWeekDays(weekStart)

  // --- Vakter ---

  function openAddShift() {
    setEditingShift(null)
    setShiftForm({ ...emptyShiftForm, shift_date: toISODate(weekStart) })
    setShiftDialogOpen(true)
  }

  function openEditShift(shift: ShiftWithEmployee) {
    setEditingShift(shift)
    setShiftForm({
      employee_id: shift.employee_id,
      shift_date: shift.shift_date,
      start_time: formatTime(shift.start_time),
      end_time: formatTime(shift.end_time),
      role: shift.role ?? "",
      note: shift.note ?? "",
    })
    setShiftDialogOpen(true)
  }

  async function handleSaveShift() {
    if (
      !shiftForm.employee_id ||
      !shiftForm.shift_date ||
      !shiftForm.start_time ||
      !shiftForm.end_time
    ) {
      toast.error("Fyll ut ansatt, dato og tider")
      return
    }

    // Myk overlapp-sjekk: samme ansatt + dag gir advarsel, men lagring tillates
    const overlap = shifts.some(
      (s) =>
        s.employee_id === shiftForm.employee_id &&
        s.shift_date === shiftForm.shift_date &&
        s.id !== editingShift?.id,
    )
    if (overlap) {
      const name = employees.find((e) => e.id === shiftForm.employee_id)?.name
      toast.warning(`${name ?? "Ansatt"} har allerede en vakt denne dagen`)
    }

    setSaving(true)
    try {
      if (editingShift) {
        await updateShift(editingShift.id, {
          employee_id: shiftForm.employee_id,
          shift_date: shiftForm.shift_date,
          start_time: shiftForm.start_time,
          end_time: shiftForm.end_time,
          role: shiftForm.role || null,
          note: shiftForm.note || null,
        })
        toast.success("Vakt oppdatert")
      } else {
        await createShift({
          employee_id: shiftForm.employee_id,
          shift_date: shiftForm.shift_date,
          start_time: shiftForm.start_time,
          end_time: shiftForm.end_time,
          role: shiftForm.role || undefined,
          note: shiftForm.note || undefined,
        })
        toast.success("Vakt opprettet")
      }
      setShiftDialogOpen(false)
      await fetchShifts()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Noe gikk galt"
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  function confirmDeleteShift(shift: ShiftWithEmployee) {
    setDeleteShiftTarget(shift)
    setDeleteShiftDialogOpen(true)
  }

  async function handleDeleteShift() {
    if (!deleteShiftTarget) return

    setSaving(true)
    try {
      await deleteShift(deleteShiftTarget.id)
      toast.success("Vakt slettet")
      setDeleteShiftDialogOpen(false)
      setDeleteShiftTarget(null)
      await fetchShifts()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Noe gikk galt"
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  // --- Ansatte ---

  function openAddEmployee() {
    setEditingEmployee(null)
    setEmployeeForm(emptyEmployeeForm)
    setEmployeeDialogOpen(true)
  }

  function openEditEmployee(employee: Employee) {
    setEditingEmployee(employee)
    setEmployeeForm({
      name: employee.name,
      neon_color: employee.neon_color,
      is_active: employee.is_active,
    })
    setEmployeeDialogOpen(true)
  }

  async function handleSaveEmployee() {
    if (!employeeForm.name.trim()) {
      toast.error("Fyll ut navn")
      return
    }

    setSaving(true)
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, {
          name: employeeForm.name.trim(),
          neon_color: employeeForm.neon_color,
          is_active: employeeForm.is_active,
        })
        toast.success(`"${employeeForm.name.trim()}" oppdatert`)
      } else {
        await createEmployee({
          name: employeeForm.name.trim(),
          neon_color: employeeForm.neon_color,
        })
        toast.success(`"${employeeForm.name.trim()}" lagt til`)
      }
      setEmployeeDialogOpen(false)
      await fetchEmployees()
      await fetchShifts()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Noe gikk galt"
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  function confirmDeleteEmployee(employee: Employee) {
    setDeleteEmployeeTarget(employee)
    setDeleteEmployeeDialogOpen(true)
  }

  async function handleDeleteEmployee() {
    if (!deleteEmployeeTarget) return

    setSaving(true)
    try {
      await deleteEmployee(deleteEmployeeTarget.id)
      toast.success(`"${deleteEmployeeTarget.name}" slettet`)
      setDeleteEmployeeDialogOpen(false)
      setDeleteEmployeeTarget(null)
      await fetchEmployees()
      await fetchShifts()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Noe gikk galt"
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  async function handleCopyLink(employee: Employee) {
    const url = `${window.location.origin}/vakt/${employee.share_token}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Lenke kopiert")
    } catch {
      toast.error("Kunne ikke kopiere lenken")
    }
  }

  function confirmRegenerate(employee: Employee) {
    setRegenTarget(employee)
    setRegenDialogOpen(true)
  }

  async function handleRegenerate() {
    if (!regenTarget) return

    setSaving(true)
    try {
      const newToken = await regenerateEmployeeToken(regenTarget.id)
      await navigator.clipboard
        .writeText(`${window.location.origin}/vakt/${newToken}`)
        .then(() => toast.success("Ny lenke laget og kopiert"))
        .catch(() => toast.success("Ny lenke laget"))
      setRegenDialogOpen(false)
      setRegenTarget(null)
      await fetchEmployees()
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
        <h1 className="text-3xl font-bold text-white">Vaktplan</h1>
        <p className="text-gray-400 mt-1">
          Administrer ansatte og vakter. Hver ansatt har en personlig lenke til
          vaktplanen.
        </p>
      </div>

      <Tabs defaultValue="vaktplan">
        <TabsList className="bg-[#1a1a1a] border border-white/10">
          <TabsTrigger value="vaktplan">Vaktplan</TabsTrigger>
          <TabsTrigger value="ansatte">Ansatte</TabsTrigger>
        </TabsList>

        {/* --- Tab: Vaktplan --- */}
        <TabsContent value="vaktplan" className="space-y-4 mt-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-white"
                onClick={() => setWeekStart((w) => addDays(w, -7))}
                aria-label="Forrige uke"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-white font-medium min-w-44 text-center">
                {formatWeekLabel(weekStart)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-white"
                onClick={() => setWeekStart((w) => addDays(w, 7))}
                aria-label="Neste uke"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                onClick={() => setWeekStart(getMonday(new Date()))}
              >
                Denne uken
              </Button>
            </div>
            <Button
              onClick={openAddShift}
              size="sm"
              disabled={activeEmployees.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ny vakt
            </Button>
          </div>

          {employees.length === 0 && (
            <Card className="bg-[#1a1a1a] border-white/10">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-gray-600 mb-4" />
                <p className="text-gray-400 text-lg mb-2">Legg til ansatte først</p>
                <p className="text-gray-500 text-sm mb-4">
                  Du trenger minst én ansatt for å opprette vakter.
                </p>
                <Button onClick={openAddEmployee} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Legg til ansatt
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {weekDays.map((day, i) => {
              const dayISO = toISODate(day)
              const dayShifts = shifts.filter((s) => s.shift_date === dayISO)
              const isToday = dayISO === todayISO
              return (
                <Card
                  key={dayISO}
                  className={
                    isToday
                      ? "bg-[#1a1a1a] border-neon-cyan/50"
                      : "bg-[#1a1a1a] border-white/10"
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-white">
                        {DAY_NAMES[i]}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {day.toLocaleDateString("nb", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      {isToday && (
                        <Badge className="bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20">
                          I dag
                        </Badge>
                      )}
                    </div>
                    {dayShifts.length === 0 ? (
                      <p className="text-sm text-gray-600">Ingen vakter</p>
                    ) : (
                      <div className="space-y-2">
                        {dayShifts.map((shift) => {
                          const color = getNeonColor(
                            shift.employees?.neon_color ?? "cyan",
                          )
                          return (
                            <div
                              key={shift.id}
                              className="flex items-center gap-3 rounded-lg bg-black/30 px-3 py-2"
                            >
                              <Badge
                                variant="outline"
                                className={`border-white/20 ${color.textClass}`}
                              >
                                {shift.employees?.name ?? "Ukjent"}
                              </Badge>
                              <span className="text-white text-sm font-medium">
                                {formatTime(shift.start_time)}–
                                {formatTime(shift.end_time)}
                              </span>
                              {shift.role && (
                                <span className="text-sm text-gray-400">
                                  {shift.role}
                                </span>
                              )}
                              {shift.note && (
                                <span className="text-sm text-gray-500 truncate">
                                  {shift.note}
                                </span>
                              )}
                              <div className="flex gap-1 ml-auto">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-gray-400 hover:text-white"
                                  onClick={() => openEditShift(shift)}
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-gray-400 hover:text-red-400"
                                  onClick={() => confirmDeleteShift(shift)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* --- Tab: Ansatte --- */}
        <TabsContent value="ansatte" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button onClick={openAddEmployee} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ny ansatt
            </Button>
          </div>

          {employees.length === 0 ? (
            <Card className="bg-[#1a1a1a] border-white/10">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Users className="h-12 w-12 text-gray-600 mb-4" />
                <p className="text-gray-400 text-lg mb-2">Ingen ansatte ennå</p>
                <p className="text-gray-500 text-sm mb-4">
                  Legg til ansatte for å komme i gang med vaktplanen.
                </p>
                <Button onClick={openAddEmployee} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Legg til ansatt
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-[#1a1a1a] border-white/10">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-gray-400">Navn</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Vaktlenke</TableHead>
                      <TableHead className="text-gray-400 text-right">
                        Handlinger
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => {
                      const color = getNeonColor(employee.neon_color)
                      return (
                        <TableRow
                          key={employee.id}
                          className="border-white/10 hover:bg-white/5"
                        >
                          <TableCell
                            className={`font-medium ${color.textClass}`}
                          >
                            {employee.name}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                employee.is_active
                                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                                  : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                              }
                            >
                              {employee.is_active ? "Aktiv" : "Inaktiv"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-white/10 text-gray-300 hover:text-white bg-transparent"
                                onClick={() => handleCopyLink(employee)}
                              >
                                <Copy className="h-3.5 w-3.5 mr-1.5" />
                                Kopier lenke
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-white/10 text-gray-300 hover:text-white bg-transparent"
                                onClick={() => confirmRegenerate(employee)}
                              >
                                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                                Ny lenke
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-white"
                                onClick={() => openEditEmployee(employee)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-red-400"
                                onClick={() => confirmDeleteEmployee(employee)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Vakt-dialog */}
      <Dialog open={shiftDialogOpen} onOpenChange={setShiftDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingShift ? "Rediger vakt" : "Ny vakt"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingShift
                ? "Oppdater detaljer for vakten."
                : "Fyll ut skjemaet for å opprette en ny vakt."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="shift-employee" className="text-gray-300">
                Ansatt
              </Label>
              <Select
                value={shiftForm.employee_id}
                onValueChange={(v) =>
                  setShiftForm((f) => ({ ...f, employee_id: v }))
                }
              >
                <SelectTrigger
                  id="shift-employee"
                  className="bg-black/40 border-white/10 text-white"
                >
                  <SelectValue placeholder="Velg ansatt" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  {employees
                    .filter(
                      (e) =>
                        e.is_active || e.id === editingShift?.employee_id,
                    )
                    .map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name}
                        {!e.is_active && " (inaktiv)"}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="shift-date" className="text-gray-300">
                Dato
              </Label>
              <Input
                id="shift-date"
                type="date"
                value={shiftForm.shift_date}
                onChange={(e) =>
                  setShiftForm((f) => ({ ...f, shift_date: e.target.value }))
                }
                className="bg-black/40 border-white/10 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shift-start" className="text-gray-300">
                  Starttid
                </Label>
                <Input
                  id="shift-start"
                  type="time"
                  value={shiftForm.start_time}
                  onChange={(e) =>
                    setShiftForm((f) => ({ ...f, start_time: e.target.value }))
                  }
                  className="bg-black/40 border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="shift-end" className="text-gray-300">
                  Sluttid
                </Label>
                <Input
                  id="shift-end"
                  type="time"
                  value={shiftForm.end_time}
                  onChange={(e) =>
                    setShiftForm((f) => ({ ...f, end_time: e.target.value }))
                  }
                  className="bg-black/40 border-white/10 text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="shift-role" className="text-gray-300">
                Rolle (valgfritt)
              </Label>
              <Input
                id="shift-role"
                value={shiftForm.role}
                onChange={(e) =>
                  setShiftForm((f) => ({ ...f, role: e.target.value }))
                }
                placeholder="F.eks. Bartender"
                className="bg-black/40 border-white/10 text-white"
              />
            </div>

            <div>
              <Label htmlFor="shift-note" className="text-gray-300">
                Notat (valgfritt)
              </Label>
              <Textarea
                id="shift-note"
                value={shiftForm.note}
                onChange={(e) =>
                  setShiftForm((f) => ({ ...f, note: e.target.value }))
                }
                placeholder="F.eks. Husk varelevering kl. 21"
                className="bg-black/40 border-white/10 text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-gray-400">
                Avbryt
              </Button>
            </DialogClose>
            <Button onClick={handleSaveShift} disabled={saving}>
              {saving
                ? "Lagrer..."
                : editingShift
                  ? "Lagre endringer"
                  : "Opprett"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Slett vakt-dialog */}
      <Dialog
        open={deleteShiftDialogOpen}
        onOpenChange={setDeleteShiftDialogOpen}
      >
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Bekreft sletting</DialogTitle>
            <DialogDescription className="text-gray-400">
              Er du sikker på at du vil slette vakten til{" "}
              {deleteShiftTarget?.employees?.name ?? "denne ansatte"}{" "}
              {deleteShiftTarget && (
                <>
                  {formatTime(deleteShiftTarget.start_time)}–
                  {formatTime(deleteShiftTarget.end_time)}
                </>
              )}
              ? Denne handlingen kan ikke angres.
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
              onClick={handleDeleteShift}
              disabled={saving}
            >
              {saving ? "Sletter..." : "Slett"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ansatt-dialog */}
      <Dialog open={employeeDialogOpen} onOpenChange={setEmployeeDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? "Rediger ansatt" : "Ny ansatt"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingEmployee
                ? "Oppdater detaljer for den ansatte."
                : "Den ansatte får automatisk en personlig vaktlenke."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="employee-name" className="text-gray-300">
                Navn
              </Label>
              <Input
                id="employee-name"
                value={employeeForm.name}
                onChange={(e) =>
                  setEmployeeForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="F.eks. Kari"
                className="bg-black/40 border-white/10 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employee-color" className="text-gray-300">
                  Farge
                </Label>
                <Select
                  value={employeeForm.neon_color}
                  onValueChange={(v) =>
                    setEmployeeForm((f) => ({
                      ...f,
                      neon_color: v as NeonColor,
                    }))
                  }
                >
                  <SelectTrigger
                    id="employee-color"
                    className="bg-black/40 border-white/10 text-white"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10">
                    {NEON_COLORS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        <span className={getNeonColor(c.value).textClass}>
                          {c.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {editingEmployee && (
                <div>
                  <Label htmlFor="employee-status" className="text-gray-300">
                    Status
                  </Label>
                  <Select
                    value={employeeForm.is_active ? "aktiv" : "inaktiv"}
                    onValueChange={(v) =>
                      setEmployeeForm((f) => ({
                        ...f,
                        is_active: v === "aktiv",
                      }))
                    }
                  >
                    <SelectTrigger
                      id="employee-status"
                      className="bg-black/40 border-white/10 text-white"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-white/10">
                      <SelectItem value="aktiv">Aktiv</SelectItem>
                      <SelectItem value="inaktiv">Inaktiv</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    Inaktiv ansatt mister tilgang til vaktlenken sin.
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-gray-400">
                Avbryt
              </Button>
            </DialogClose>
            <Button onClick={handleSaveEmployee} disabled={saving}>
              {saving
                ? "Lagrer..."
                : editingEmployee
                  ? "Lagre endringer"
                  : "Legg til"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Slett ansatt-dialog */}
      <Dialog
        open={deleteEmployeeDialogOpen}
        onOpenChange={setDeleteEmployeeDialogOpen}
      >
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Bekreft sletting</DialogTitle>
            <DialogDescription className="text-gray-400">
              Er du sikker på at du vil slette &quot;
              {deleteEmployeeTarget?.name}&quot;? Alle vakter for{" "}
              {deleteEmployeeTarget?.name} slettes også, og vaktlenken slutter å
              virke. Denne handlingen kan ikke angres.
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
              onClick={handleDeleteEmployee}
              disabled={saving}
            >
              {saving ? "Sletter..." : "Slett"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Regenerer lenke-dialog */}
      <Dialog open={regenDialogOpen} onOpenChange={setRegenDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Lag ny vaktlenke</DialogTitle>
            <DialogDescription className="text-gray-400">
              Den gamle lenken slutter å virke umiddelbart.{" "}
              {regenTarget?.name} må få den nye lenken.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-gray-400">
                Avbryt
              </Button>
            </DialogClose>
            <Button onClick={handleRegenerate} disabled={saving}>
              {saving ? "Lager..." : "Lag ny lenke"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
