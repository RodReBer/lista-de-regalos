import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gift, Mail } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Gift className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold text-foreground">Lista de Regalos</span>
          </Link>
        </div>

        <Card className="border shadow-lg">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Revisa tu email</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Te hemos enviado un enlace de confirmación. Por favor, revisa tu bandeja de entrada y haz clic en el
              enlace para activar tu cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg text-sm text-muted-foreground leading-relaxed border border-border/50">
              <p className="font-medium text-foreground mb-1">Consejo:</p>
              Si no ves el email, revisa tu carpeta de spam o correo no deseado.
            </div>
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/auth/login">Volver al inicio de sesión</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
