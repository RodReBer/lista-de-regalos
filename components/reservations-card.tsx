import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, MessageSquare, Package } from "lucide-react"

interface ReservationsCardProps {
  listId: string
}

export async function ReservationsCard({ listId }: ReservationsCardProps) {
  const supabase = await createClient()

  // Fetch all reservations for items in this list
  const { data: reservations, error } = await supabase
    .from("reservations")
    .select(
      `
      *,
      gift_items!inner(
        id,
        name,
        list_id
      )
    `,
    )
    .eq("gift_items.list_id", listId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching reservations:", error)
    return null
  }

  const totalReservations = reservations?.length || 0
  const totalQuantity = reservations?.reduce((sum, r) => sum + r.quantity, 0) || 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Reservas
        </CardTitle>
        <CardDescription>
          {totalReservations} reserva{totalReservations !== 1 ? "s" : ""} • {totalQuantity} producto
          {totalQuantity !== 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!reservations || reservations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">Aún no hay reservas</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="border border-border rounded-lg p-4 space-y-2 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{reservation.gift_items.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {reservation.quantity} unidad{reservation.quantity !== 1 ? "es" : ""}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4 shrink-0" />
                    <span className="truncate">{reservation.reserver_name}</span>
                  </div>
                  {reservation.reserver_email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span className="truncate">{reservation.reserver_email}</span>
                    </div>
                  )}
                  {reservation.message && (
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MessageSquare className="h-4 w-4 shrink-0 mt-0.5" />
                      <span className="text-xs leading-relaxed">{reservation.message}</span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-muted-foreground pt-1 border-t border-border">
                  {new Date(reservation.created_at).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
