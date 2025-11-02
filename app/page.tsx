import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Gift } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Gift className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">Lista de Regalos</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Iniciar sesión
          </Link>
          <Button asChild>
            <Link href="/auth/sign-up">Crear cuenta</Link>
          </Button>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Crea y comparte tus listas de regalos</h1>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Para baby showers, cumpleaños, bodas y más. Permite que tus invitados sepan exactamente qué regalarte.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">Comenzar gratis</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Ver cómo funciona</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="p-6 border border-border rounded-lg">
            <div className="mb-4">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Crea tu lista</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Agrega productos con fotos y descripciones. Personaliza con colores y portadas.
            </p>
          </div>

          <div className="p-6 border border-border rounded-lg">
            <div className="mb-4">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Comparte fácilmente</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Genera un enlace único para compartir con amigos y familia.
            </p>
          </div>

          <div className="p-6 border border-border rounded-lg">
            <div className="mb-4">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Recibe reservas</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Tus invitados reservan regalos para evitar duplicados.
            </p>
          </div>
        </div>
      </section>

      <footer className="container mx-auto px-4 py-8 border-t border-border mt-20 text-center text-muted-foreground text-sm">
        <p>© 2025 Lista de Regalos. Hecho para tus celebraciones.</p>
      </footer>
    </div>
  )
}
