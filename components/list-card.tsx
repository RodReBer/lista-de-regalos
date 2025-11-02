"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, ExternalLink, MoreVertical, Package, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ListCardProps {
  id: string
  title: string
  description?: string
  coverImage?: string
  themeColor: string
  slug: string
  eventDate?: string
  itemCount: number
}

export function ListCard({
  id,
  title,
  description,
  coverImage,
  themeColor,
  slug,
  eventDate,
  itemCount,
}: ListCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta lista? Esta acción no se puede deshacer.")) {
      return
    }

    setIsDeleting(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("gift_lists").delete().eq("id", id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error deleting list:", error)
      alert("Hubo un error al eliminar la lista")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-all duration-300 group bg-card border-border">
      <div
        className="h-40 flex items-center justify-center relative"
        style={{
          backgroundColor: coverImage ? "transparent" : themeColor,
          backgroundImage: coverImage ? `url(${coverImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${id}`} className="cursor-pointer">
                  Editar lista
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/list/${slug}`} target="_blank" className="cursor-pointer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ver página pública
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardHeader className="pb-3">
        <h3 className="font-semibold text-base line-clamp-1">{title}</h3>
        {description && <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>}
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            <span>{itemCount} productos</span>
          </div>
          {eventDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(eventDate).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full hover:bg-primary/10 hover:border-primary transition-colors bg-transparent"
          asChild
        >
          <Link href={`/dashboard/${id}`}>Gestionar</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
