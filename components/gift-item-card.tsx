"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { EditItemDialog } from "./edit-item-dialog"

interface GiftItemCardProps {
  item: {
    id: string
    name: string
    description?: string
    link?: string
    image_url?: string
    quantity: number
    reserved_count: number
  }
}

export function GiftItemCard({ item }: GiftItemCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      return
    }

    setIsDeleting(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("gift_items").delete().eq("id", item.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error deleting item:", error)
      alert("Error al eliminar el producto")
    } finally {
      setIsDeleting(false)
    }
  }

  const availableCount = item.quantity - item.reserved_count

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square relative bg-muted">
        {item.image_url ? (
          <img src={item.image_url || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">Sin imagen</div>
        )}
        {item.reserved_count > 0 && (
          <Badge className="absolute top-2 right-2 bg-secondary text-secondary-foreground">
            {item.reserved_count} reservado{item.reserved_count > 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{item.name}</h3>
        {item.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.description}</p>}
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="outline">
            {availableCount} de {item.quantity} disponible{availableCount !== 1 ? "s" : ""}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        {item.link && (
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Ver producto
            </a>
          </Button>
        )}
        <EditItemDialog item={item} />
        <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isDeleting}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardFooter>
    </Card>
  )
}
