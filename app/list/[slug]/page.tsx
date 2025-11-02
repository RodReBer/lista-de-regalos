"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { PublicGiftItem } from "@/components/public-gift-item"
import { ReserveDialog } from "@/components/reserve-dialog"
import { Gift, Calendar, Sparkles } from "lucide-react"
import { notFound, useParams } from "next/navigation"

interface ListaDeRegalos {
  id: string
  title: string
  description?: string
  cover_image?: string
  theme_color: string
  event_date?: string
}

interface GiftItem {
  id: string
  name: string
  description?: string
  link?: string
  image_url?: string
  quantity: number
  reserved_count: number
}

export default function PublicListPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [list, setList] = useState<ListaDeRegalos | null>(null)
  const [items, setItems] = useState<GiftItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<GiftItem | null>(null)
  const [reserveDialogOpen, setReserveDialogOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Fetch list
      const { data: listData, error: listError } = await supabase
        .from("gift_lists")
        .select("*")
        .eq("slug", slug)
        .single()

      if (listError || !listData) {
        notFound()
        return
      }

      setList(listData)

      // Fetch items
      const { data: itemsData, error: itemsError } = await supabase
        .from("gift_items")
        .select("*")
        .eq("list_id", listData.id)
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false })

      if (!itemsError && itemsData) {
        setItems(itemsData)
      }

      setLoading(false)
    }

    fetchData()
  }, [slug])

  const handleReserve = (itemId: string) => {
    const item = items.find((i) => i.id === itemId)
    if (item) {
      setSelectedItem(item)
      setReserveDialogOpen(true)
    }
  }

  const handleDialogClose = () => {
    setReserveDialogOpen(false)
    // Refresh data after reservation
    const refreshData = async () => {
      const supabase = createClient()
      const { data: itemsData } = await supabase
        .from("gift_items")
        .select("*")
        .eq("list_id", list?.id)
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false })

      if (itemsData) {
        setItems(itemsData)
      }
    }
    refreshData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando lista...</p>
        </div>
      </div>
    )
  }

  if (!list) {
    return notFound()
  }

  const totalItems = items.length
  const totalReserved = items.reduce((sum, item) => sum + item.reserved_count, 0)
  const totalAvailable = items.reduce((sum, item) => sum + (item.quantity - item.reserved_count), 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Gift className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">Lista de Regalos</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: list.cover_image ? "transparent" : list.theme_color,
          backgroundImage: list.cover_image ? `url(${list.cover_image})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium">ListaDeRegalos</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-balance">{list.title}</h1>
            {list.description && <p className="text-lg md:text-xl opacity-90 mb-6 text-balance">{list.description}</p>}
            <div className="flex flex-wrap gap-4 justify-center text-sm md:text-base">
              {list.event_date && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Calendar className="h-5 w-5" />
                  <span>{new Date(list.event_date).toLocaleDateString("es-ES", { dateStyle: "long" })}</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Gift className="h-5 w-5" />
                <span>
                  {totalItems} producto{totalItems !== 1 ? "s" : ""} • {totalAvailable} disponible
                  {totalAvailable !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Items Section */}
      <main className="container mx-auto px-4 py-12">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-card rounded-xl p-12 max-w-md mx-auto border border-dashed border-border">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Lista vacía</h2>
              <p className="text-muted-foreground">Aún no hay productos en esta lista</p>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Elige tu regalo</h2>
              <p className="text-muted-foreground">Selecciona un producto y reserva para evitar duplicados</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {items.map((item) => (
                <PublicGiftItem key={item.id} item={item} onReserve={handleReserve} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground text-sm">
            Creado con{" "}
            <a href="/" className="text-primary hover:underline font-medium">
              Lista de Regalos
            </a>
          </p>
        </div>
      </footer>

      <ReserveDialog open={reserveDialogOpen} onOpenChange={handleDialogClose} item={selectedItem} />
    </div>
  )
}
