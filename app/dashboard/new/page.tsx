"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const THEME_COLORS = [
  { name: "Rosa", value: "#fbbf24" },
  { name: "Lavanda", value: "#c084fc" },
  { name: "Azul cielo", value: "#7dd3fc" },
  { name: "Verde menta", value: "#86efac" },
  { name: "Coral", value: "#fb923c" },
  { name: "Lila", value: "#d8b4fe" },
]

export default function NewListPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    themeColor: THEME_COLORS[0].value,
    eventDate: "",
    coverImage: "",
  })

  const generateSlug = (title: string) => {
    return (
      title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") +
      "-" +
      Math.random().toString(36).substring(2, 8)
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("No autenticado")

      const slug = generateSlug(formData.title)

      const { data, error: insertError } = await supabase
        .from("gift_lists")
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description || null,
          theme_color: formData.themeColor,
          event_date: formData.eventDate || null,
          cover_image: formData.coverImage || null,
          slug,
        })
        .select()
        .single()

      if (insertError) throw insertError

      router.push(`/dashboard/${data.id}`)
      router.refresh()
    } catch (err) {
      console.error("Error creating list:", err)
      setError(err instanceof Error ? err.message : "Error al crear la lista")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al dashboard
          </Link>
        </Button>

        <Card className="border shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Crear nueva lista</CardTitle>
            <CardDescription>Configura los detalles básicos de tu Lista de Regalos</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Título de la lista <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Ej: Baby shower de María"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe tu evento o agrega un mensaje especial..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventDate">Fecha del evento</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label>Color del tema</Label>
                <div className="grid grid-cols-3 gap-3">
                  {THEME_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, themeColor: color.value })}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                        formData.themeColor === color.value ? "border-primary ring-2 ring-primary/20" : "border-border"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: color.value }} />
                      <span className="text-sm font-medium">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage">URL de imagen de portada (opcional)</Label>
                <Input
                  id="coverImage"
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  Puedes usar una imagen de Unsplash, Pexels o cualquier URL pública
                </p>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1 bg-transparent" asChild>
                  <Link href="/dashboard">Cancelar</Link>
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Creando..." : "Crear lista"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
