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
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface AddItemDialogProps {
  listId: string
}

export function AddItemDialog({ listId }: AddItemDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    link: "",
    imageUrl: "",
    quantity: 1,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("gift_items").insert({
        list_id: listId,
        name: formData.name,
        description: formData.description || null,
        link: formData.link || null,
        image_url: formData.imageUrl || null,
        quantity: formData.quantity,
      })

      if (error) throw error

      setFormData({
        name: "",
        description: "",
        link: "",
        imageUrl: "",
        quantity: 1,
      })
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error adding item:", error)
      alert("Error al agregar el producto")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar producto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Agregar producto</DialogTitle>
            <DialogDescription>Agrega un nuevo producto a tu Lista de Regalos</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre del producto <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ej: Pañales talla M"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Detalles adicionales sobre el producto..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Link de compra</Label>
              <Input
                id="link"
                type="url"
                placeholder="https://..."
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL de imagen</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
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
              {isLoading ? "Agregando..." : "Agregar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
