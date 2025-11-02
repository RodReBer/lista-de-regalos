import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { ListCard } from "@/components/list-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Gift } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  // Fetch user's gift lists with item counts
  const { data: lists, error: listsError } = await supabase
    .from("gift_lists")
    .select(
      `
      *,
      gift_items(count)
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (listsError) {
    console.error("Error fetching lists:", listsError)
  }

  const listsWithCounts =
    lists?.map((list) => ({
      ...list,
      itemCount: Array.isArray(list.gift_items) ? list.gift_items.length : 0,
    })) || []

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userEmail={user.email} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Mis listas de regalos</h1>
            <p className="text-muted-foreground">Crea y gestiona tus listas para cualquier ocasión especial</p>
          </div>
          <Button size="lg" className="rounded-lg" asChild>
            <Link href="/dashboard/new">
              <Plus className="mr-2 h-5 w-5" />
              Nueva lista
            </Link>
          </Button>
        </div>

        {listsWithCounts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-card border border-border rounded-xl p-12 max-w-md mx-auto">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-foreground">Crea tu primera lista</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Comienza agregando productos que te gustaría recibir para tu próxima celebración
              </p>
              <Button asChild>
                <Link href="/dashboard/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear lista
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listsWithCounts.map((list) => (
              <ListCard
                key={list.id}
                id={list.id}
                title={list.title}
                description={list.description}
                coverImage={list.cover_image}
                themeColor={list.theme_color}
                slug={list.slug}
                eventDate={list.event_date}
                itemCount={list.itemCount}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
