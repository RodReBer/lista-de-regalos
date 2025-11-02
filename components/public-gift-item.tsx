"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Gift } from "lucide-react"

interface PublicGiftItemProps {
  item: {
    id: string
    name: string
    description?: string
    link?: string
    image_url?: string
    quantity: number
    reserved_count: number
  }
  onReserve: (itemId: string) => void
}

export function PublicGiftItem({ item, onReserve }: PublicGiftItemProps) {
  const availableCount = item.quantity - item.reserved_count
  const isFullyReserved = availableCount <= 0

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-[1.02]">
      <div className="aspect-square relative bg-muted">
        {item.image_url ? (
          <img src={item.image_url || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Gift className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
        {isFullyReserved && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge className="text-base px-4 py-2">Reservado</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{item.name}</h3>
        {item.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>}
        <div className="flex items-center gap-2">
          {isFullyReserved ? (
            <Badge variant="secondary" className="text-xs">
              Completamente reservado
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              {availableCount} disponible{availableCount !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        {item.link && (
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Ver
            </a>
          </Button>
        )}
        <Button size="sm" className="flex-1" onClick={() => onReserve(item.id)} disabled={isFullyReserved}>
          <Gift className="mr-2 h-4 w-4" />
          Reservar
        </Button>
      </CardFooter>
    </Card>
  )
}
