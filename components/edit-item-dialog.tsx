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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Pencil } from "lucide-react"
import { useRouter } from "next/navigation"

interface EditItemDialogProps {
  item: {
    id: string
    name: string
    description?: string
    link?: string
    image_url?: string
    quantity: number
  }
}

export function EditItemDialog({ item }: EditItemDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: item.name,
    description: item.description || "",
    link: item.link || "",
    imageUrl: item.image_url || "",
    quantity: item.quantity,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("gift_items")
        .update({
          name: formData.name,
          description: formData.description || null,
          link: formData.link || null,
          image_url: formData.imageUrl || null,
          quantity: formData.quantity,
        })
        .eq("id", item.id)

      if (error) throw error

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating item:", error)
      alert("Error al actualizar el producto")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar producto</DialogTitle>
            <DialogDescription>Modifica los detalles del producto</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">
                Nombre del producto <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-name"
                placeholder="Ej: Pañales talla M"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                placeholder="Detalles adicionales sobre el producto..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-link">Link de compra</Label>
              <Input
                id="edit-link"
                type="url"
                placeholder="https://..."
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-imageUrl">URL de imagen</Label>
              <Input
                id="edit-imageUrl"
                type="url"
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Cantidad</Label>
              <Input
                id="edit-quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
