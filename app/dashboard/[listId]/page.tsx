import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { AddItemDialog } from "@/components/add-item-dialog"
import { GiftItemCard } from "@/components/gift-item-card"
import { ShareListCard } from "@/components/share-list-card"
import { ReservationsCard } from "@/components/reservations-card"
import { EditListDialog } from "@/components/edit-list-dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Package } from "lucide-react"
import Link from "next/link"

export default async function ListDetailPage({ params }: { params: Promise<{ listId: string }> }) {
  const { listId } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  // Fetch the list
  const { data: list, error: listError } = await supabase
    .from("gift_lists")
    .select("*")
    .eq("id", listId)
    .eq("user_id", user.id)
    .single()

  if (listError || !list) {
    redirect("/dashboard")
  }

  // Fetch items for this list
  const { data: items, error: itemsError } = await supabase
    .from("gift_items")
    .select("*")
    .eq("list_id", listId)
    .order("created_at", { ascending: false })

  if (itemsError) {
    console.error("Error fetching items:", itemsError)
  }

  const totalItems = items?.length || 0
  const totalReserved = items?.reduce((sum, item) => sum + item.reserved_count, 0) || 0

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userEmail={user.email} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a mis listas
            </Link>
          </Button>
          <EditListDialog list={list} />
        </div>

        {/* List Header */}
        <div
          className="rounded-xl p-8 mb-8 relative overflow-hidden border border-border/50"
          style={{
            backgroundColor: list.cover_image ? "transparent" : list.theme_color,
            backgroundImage: list.cover_image ? `url(${list.cover_image})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />
          <div className="relative z-10 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{list.title}</h1>
            {list.description && <p className="text-lg opacity-90 mb-4 max-w-2xl">{list.description}</p>}
            <div className="flex flex-wrap gap-4 text-sm">
              {list.event_date && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(list.event_date).toLocaleDateString("es-ES", { dateStyle: "long" })}</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Package className="h-4 w-4" />
                <span>
                  {totalItems} producto{totalItems !== 1 ? "s" : ""} • {totalReserved} reservado
                  {totalReserved !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Productos</h2>
              <AddItemDialog listId={listId} />
            </div>

            {!items || items.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-2xl border-2 border-dashed border-border">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No hay productos aún</h3>
                <p className="text-muted-foreground mb-4">Comienza agregando productos a tu lista</p>
                <AddItemDialog listId={listId} />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {items.map((item) => (
                  <GiftItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ShareListCard slug={list.slug} />
            <ReservationsCard listId={listId} />
          </div>
        </div>
      </main>
    </div>
  )
}
