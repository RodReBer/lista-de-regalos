"use client"

import { useState } from "react"
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
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Pencil, Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"

interface EditListDialogProps {
  list: {
    id: string
    title: string
    description: string | null
    event_date: string | null
    cover_image: string | null
    theme_color: string
  }
}

export function EditListDialog({ list }: EditListDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title: list.title,
    description: list.description || "",
    event_date: list.event_date || "",
    cover_image: list.cover_image || "",
    theme_color: list.theme_color || "#fbbf24",
  })

  const [previewImage, setPreviewImage] = useState<string | null>(list.cover_image)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona una imagen válida")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen debe ser menor a 5MB")
      return
    }

    setIsUploading(true)

    try {
      // Create a unique filename
      const fileExt = file.name.split(".").pop()
      const fileName = `${list.id}-${Date.now()}.${fileExt}`
      const filePath = `list-covers/${fileName}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage.from("public-images").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) throw error

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("public-images").getPublicUrl(filePath)

      setFormData((prev) => ({ ...prev, cover_image: publicUrl }))
      setPreviewImage(publicUrl)
      toast.success("Imagen subida exitosamente")
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Error al subir la imagen")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, cover_image: "" }))
    setPreviewImage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error("El título es requerido")
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("gift_lists")
        .update({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          event_date: formData.event_date || null,
          cover_image: formData.cover_image || null,
          theme_color: formData.theme_color,
          updated_at: new Date().toISOString(),
        })
        .eq("id", list.id)

      if (error) throw error

      toast.success("Lista actualizada exitosamente")
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating list:", error)
      toast.error("Error al actualizar la lista")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-2" />
          Editar celebración
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar celebración</DialogTitle>
          <DialogDescription>Actualiza los detalles de tu lista de regalos</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Título de la celebración <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Ej: Mi Cumpleaños 2025"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Agrega una descripción para tu lista..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Event Date */}
            <div className="space-y-2">
              <Label htmlFor="event_date">Fecha del evento</Label>
              <Input
                id="event_date"
                type="date"
                value={formData.event_date}
                onChange={(e) => setFormData((prev) => ({ ...prev, event_date: e.target.value }))}
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <Label>Imagen de portada</Label>
              {previewImage ? (
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="cover_image"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click para subir</span> o arrastra una imagen
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF (MAX. 5MB)</p>
                    </div>
                    <input
                      id="cover_image"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              )}
              {isUploading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Subiendo imagen...
                </div>
              )}
            </div>

            {/* Theme Color */}
            <div className="space-y-2">
              <Label htmlFor="theme_color">Color de tema (si no hay imagen)</Label>
              <div className="flex gap-3 items-center">
                <Input
                  id="theme_color"
                  type="color"
                  value={formData.theme_color}
                  onChange={(e) => setFormData((prev) => ({ ...prev, theme_color: e.target.value }))}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={formData.theme_color}
                  onChange={(e) => setFormData((prev) => ({ ...prev, theme_color: e.target.value }))}
                  placeholder="#fbbf24"
                  className="font-mono"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Este color se usa de fondo si no hay imagen de portada
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || isUploading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
