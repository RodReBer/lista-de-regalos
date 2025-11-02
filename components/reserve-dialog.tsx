"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

interface ReserveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: {
    id: string
    name: string
    quantity: number
    reserved_count: number
  } | null
}

export function ReserveDialog({ open, onOpenChange, item }: ReserveDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    quantity: 1,
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!item) return

    setIsLoading(true)
    const supabase = createClient()

    try {
      const availableCount = item.quantity - item.reserved_count

      if (formData.quantity > availableCount) {
        alert(`Solo hay ${availableCount} unidad(es) disponible(s)`)
        setIsLoading(false)
        return
      }

      const { error } = await supabase.from("reservations").insert({
        item_id: item.id,
        reserver_name: formData.name,
        reserver_email: formData.email || null,
        quantity: formData.quantity,
        message: formData.message || null,
      })

      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onOpenChange(false)
        setFormData({ name: "", email: "", quantity: 1, message: "" })
        router.refresh()
      }, 2000)
    } catch (error) {
      console.error("Error creating reservation:", error)
      alert("Error al reservar el producto. Por favor intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!item) return null

  const availableCount = item.quantity - item.reserved_count

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {success ? (
          <div className="py-8 text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Reserva confirmada</h3>
            <p className="text-muted-foreground">Tu reserva ha sido registrada exitosamente</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Reservar: {item.name}</DialogTitle>
              <DialogDescription>
                Completa tus datos para reservar este regalo. {availableCount} disponible
                {availableCount !== 1 ? "s" : ""}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reserve-name">
                  Tu nombre <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="reserve-name"
                  placeholder="Ej: Juan Pérez"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reserve-email">Email (opcional)</Label>
                <Input
                  id="reserve-email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reserve-quantity">
                  Cantidad <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="reserve-quantity"
                  type="number"
                  min="1"
                  max={availableCount}
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || 1 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reserve-message">Mensaje (opcional)</Label>
                <Textarea
                  id="reserve-message"
                  placeholder="Deja un mensaje para el organizador..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Reservando..." : "Confirmar reserva"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
