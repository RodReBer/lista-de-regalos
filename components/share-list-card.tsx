"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Check, Copy, ExternalLink } from "lucide-react"

interface ShareListCardProps {
  slug: string
}

export function ShareListCard({ slug }: ShareListCardProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/list/${slug}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Error copying to clipboard:", error)
    }
  }

  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-lg">Compartir lista</CardTitle>
        <CardDescription>Comparte este enlace con tus amigos y familia</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input value={shareUrl} readOnly className="font-mono text-sm" />
          <Button onClick={handleCopy} variant="outline" size="icon" className="shrink-0 bg-transparent">
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <Button variant="outline" className="w-full bg-transparent" asChild>
          <a href={shareUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver página pública
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
