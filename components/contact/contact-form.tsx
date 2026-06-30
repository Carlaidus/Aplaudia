"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2, Mail, MessageCircle, Send, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { siteConfig } from "@/content/site"

type FormState = {
  name: string
  email: string
  phone: string
  service: string
  message: string
  privacy: boolean
  website: string
}

const initialFormState: FormState = {
  name: "",
  email: "",
  phone: "",
  service: "Página web",
  message: "",
  privacy: false,
  website: "",
}

const serviceOptions = [
  "Página web",
  "Agente IA para WhatsApp",
  "Visuales para marca",
  "Portfolio o caso real",
  "Consulta general",
] as const

export function ContactForm() {
  const [formData, setFormData] = useState<FormState>(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")

  const updateField = (field: keyof FormState, value: string | boolean) => {
    setFormData((current) => ({ ...current, [field]: value }))
    if (status !== "idle") {
      setStatus("idle")
      setStatusMessage("")
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formData.privacy) {
      setStatus("error")
      setStatusMessage("Acepta el uso de datos para que podamos responderte.")
      return
    }

    setIsSubmitting(true)
    setStatus("idle")
    setStatusMessage("")

    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.error ?? "No se ha podido enviar el mensaje.")
      }

      setStatus("success")
      setStatusMessage("Mensaje enviado. Te responderemos lo antes posible.")
      setFormData(initialFormState)
    } catch (error) {
      setStatus("error")
      setStatusMessage(
        error instanceof Error
          ? `${error.message} También puedes escribir directamente por WhatsApp.`
          : "No se ha podido enviar el mensaje. También puedes escribir directamente por WhatsApp.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div id="aplaudia-contact-form" className="mx-auto mt-14 max-w-5xl text-left">
      <div className="grid gap-5 rounded-[2rem] border border-white/10 bg-card/70 p-4 shadow-2xl shadow-primary/10 backdrop-blur sm:p-6 lg:grid-cols-[0.85fr_1.15fr] lg:p-7">
        <aside className="flex min-w-0 flex-col justify-between rounded-[1.5rem] border border-white/10 bg-background/70 p-5 sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Contacto real
            </p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Cuéntanos qué necesitas y te respondemos con criterio.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              El formulario envía la consulta por email. Si prefieres algo más directo, WhatsApp ya está activo.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="flex min-w-0 items-center gap-3 rounded-2xl border border-border/70 bg-card/70 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="min-w-0 truncate">{siteConfig.contact.email}</span>
            </a>

            <a
              href={siteConfig.contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#25D366]/35 bg-[#25D366]/10 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-[#25D366]/70 hover:bg-[#25D366]/15"
            >
              <MessageCircle className="h-4 w-4 shrink-0 text-[#25D366]" aria-hidden="true" />
              <span className="min-w-0 truncate">WhatsApp +34 {siteConfig.contact.whatsappNumber}</span>
            </a>

            <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card/50 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-cyan" aria-hidden="true" />
              <span>No guardamos el mensaje en base de datos. Se envía por email mediante Resend.</span>
            </div>
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="min-w-0 space-y-5 rounded-[1.5rem] border border-white/10 bg-background/60 p-5 sm:p-6">
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website}
            onChange={(event) => updateField("website", event.target.value)}
            className="hidden"
            aria-hidden="true"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <Label htmlFor="contact-name" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Nombre *
              </Label>
              <Input
                id="contact-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={formData.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="mt-2 h-12 rounded-xl border-border bg-card/80"
              />
            </div>

            <div className="min-w-0">
              <Label htmlFor="contact-email" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Email *
              </Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="mt-2 h-12 rounded-xl border-border bg-card/80"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <Label htmlFor="contact-phone" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Teléfono
              </Label>
              <Input
                id="contact-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                className="mt-2 h-12 rounded-xl border-border bg-card/80"
              />
            </div>

            <div className="min-w-0">
              <Label htmlFor="contact-service" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Servicio
              </Label>
              <select
                id="contact-service"
                name="service"
                value={formData.service}
                onChange={(event) => updateField("service", event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-border bg-card/80 px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
              >
                {serviceOptions.map((service) => (
                  <option key={service} value={service} className="bg-background text-foreground">
                    {service}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="contact-message" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Mensaje *
            </Label>
            <Textarea
              id="contact-message"
              name="message"
              required
              minLength={10}
              value={formData.message}
              onChange={(event) => updateField("message", event.target.value)}
              placeholder="Cuéntanos qué quieres mejorar, qué tienes ya y qué te gustaría conseguir."
              className="mt-2 min-h-36 resize-none rounded-xl border-border bg-card/80"
            />
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card/50 px-4 py-3">
            <Checkbox
              id="contact-privacy"
              checked={formData.privacy}
              onCheckedChange={(checked) => updateField("privacy", checked === true)}
              className="mt-0.5"
            />
            <Label htmlFor="contact-privacy" className="text-sm leading-relaxed text-muted-foreground">
              Acepto que Aplaudia use estos datos solo para responder a esta consulta.
            </Label>
          </div>

          {status !== "idle" && (
            <div
              className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
                status === "success"
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                  : "border-destructive/40 bg-destructive/10 text-foreground"
              }`}
              role="status"
              aria-live="polite"
            >
              {status === "success" ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
              )}
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 rounded-xl px-6 text-sm font-semibold"
            >
              {isSubmitting ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                  Enviar consulta
                </>
              )}
            </Button>

            <Button
              asChild
              type="button"
              variant="outline"
              className="h-12 rounded-xl border-border px-6 text-sm font-semibold"
            >
              <a href={siteConfig.contact.whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                WhatsApp directo
              </a>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
