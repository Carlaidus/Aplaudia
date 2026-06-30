"use client"

import { useMemo, useState } from "react"
import { AlertCircle, CheckCircle2, MessageCircle, RotateCcw, Send, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  contactDeliveryOptions,
  contactProjectOptions,
  defaultContactDeliveryChannel,
  defaultContactProjectType,
  getContactProjectOption,
  type ContactDeliveryChannel,
  type ContactProjectType,
} from "@/content/contact"
import { siteConfig } from "@/content/site"

type FormState = {
  name: string
  email: string
  phone: string
  projectType: ContactProjectType
  deliveryChannel: ContactDeliveryChannel
  message: string
  privacy: boolean
  website: string
}

function createInitialFormState(): FormState {
  return {
    name: "",
    email: "",
    phone: "",
    projectType: defaultContactProjectType,
    deliveryChannel: defaultContactDeliveryChannel,
    message: getContactProjectOption(defaultContactProjectType).guidedMessage,
    privacy: false,
    website: "",
  }
}

function buildWhatsAppHref(formData: FormState) {
  const project = getContactProjectOption(formData.projectType)
  const lines = [
    "Hola, Aplaudia. He visto vuestra web y quiero hablar sobre un proyecto digital.",
    "",
    `Tipo de proyecto: ${project.label}`,
    formData.name.trim() ? `Nombre: ${formData.name.trim()}` : null,
    formData.email.trim() ? `Email: ${formData.email.trim()}` : null,
    formData.phone.trim() ? `Teléfono: ${formData.phone.trim()}` : null,
    "",
    "Mensaje:",
    formData.message.trim(),
  ].filter(Boolean)

  return `https://wa.me/${siteConfig.contact.whatsappInternational}?text=${encodeURIComponent(lines.join("\n"))}`
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormState>(() => createInitialFormState())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")
  const [preparedWhatsAppHref, setPreparedWhatsAppHref] = useState<string | null>(null)

  const selectedProject = useMemo(
    () => getContactProjectOption(formData.projectType),
    [formData.projectType],
  )
  const selectedDelivery = useMemo(
    () => contactDeliveryOptions.find((option) => option.id === formData.deliveryChannel),
    [formData.deliveryChannel],
  )
  const sendsEmail = formData.deliveryChannel === "email" || formData.deliveryChannel === "both"
  const sendsWhatsApp = formData.deliveryChannel === "whatsapp" || formData.deliveryChannel === "both"

  const resetStatus = () => {
    if (status !== "idle") {
      setStatus("idle")
      setStatusMessage("")
      setPreparedWhatsAppHref(null)
    }
  }

  const updateField = (field: keyof FormState, value: string | boolean) => {
    setFormData((current) => ({ ...current, [field]: value }))
    resetStatus()
  }

  const updateProjectType = (projectType: ContactProjectType) => {
    setFormData((current) => {
      const currentSuggestion = getContactProjectOption(current.projectType).guidedMessage
      const nextSuggestion = getContactProjectOption(projectType).guidedMessage
      const shouldReplaceMessage =
        current.message.trim().length === 0 || current.message === currentSuggestion

      return {
        ...current,
        projectType,
        message: shouldReplaceMessage ? nextSuggestion : current.message,
      }
    })
    resetStatus()
  }

  const useSuggestedMessage = () => {
    setFormData((current) => ({
      ...current,
      message: getContactProjectOption(current.projectType).guidedMessage,
    }))
    resetStatus()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formData.privacy) {
      setStatus("error")
      setStatusMessage("Acepta el uso de datos para que podamos responderte.")
      return
    }

    if (sendsEmail && !formData.email.trim()) {
      setStatus("error")
      setStatusMessage("El email es obligatorio si quieres enviar la consulta por correo.")
      return
    }

    const whatsappHref = sendsWhatsApp ? buildWhatsAppHref(formData) : null

    setPreparedWhatsAppHref(whatsappHref)
    setIsSubmitting(true)
    setStatus("idle")
    setStatusMessage("")

    try {
      if (sendsEmail) {
        const response = await fetch("/api/contacto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data.error ?? "No se ha podido enviar el mensaje.")
        }
      }

      if (whatsappHref) {
        window.open(whatsappHref, "_blank", "noopener,noreferrer")
      }

      if (formData.deliveryChannel === "email") {
        setStatusMessage("Consulta enviada por email. Te responderemos lo antes posible.")
        setFormData(createInitialFormState())
      } else if (formData.deliveryChannel === "whatsapp") {
        setStatusMessage("WhatsApp está preparado con tu mensaje. Revísalo antes de enviarlo.")
      } else {
        setStatusMessage("Email enviado y WhatsApp preparado con el mismo contexto.")
        setFormData(createInitialFormState())
      }

      setStatus("success")
    } catch (error) {
      setStatus("error")
      setStatusMessage(
        error instanceof Error
          ? `${error.message} Puedes cambiar el canal a WhatsApp si quieres contactar ahora.`
          : "No se ha podido enviar el mensaje. Puedes cambiar el canal a WhatsApp si quieres contactar ahora.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitLabel =
    formData.deliveryChannel === "email"
      ? "Enviar por email"
      : formData.deliveryChannel === "whatsapp"
        ? "Abrir WhatsApp"
        : "Enviar y abrir WhatsApp"

  return (
    <div id="aplaudia-contact-form" className="mx-auto mt-14 max-w-5xl text-left">
      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-white/10 bg-card/70 p-4 shadow-2xl shadow-primary/10 backdrop-blur sm:p-6 lg:p-7"
      >
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

        <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="space-y-5 rounded-[1.5rem] border border-white/10 bg-background/70 p-5 sm:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Contacto guiado
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Un mensaje claro, por el canal que prefieras.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Elige email, WhatsApp o ambos. El texto se rellena como guía y puedes editarlo antes de enviarlo.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Canal de envío
              </p>
              <div className="mt-3 grid gap-3" role="radiogroup" aria-label="Canal de envío">
                {contactDeliveryOptions.map((option) => {
                  const isSelected = formData.deliveryChannel === option.id

                  return (
                    <button
                      key={option.id}
                      type="button"
                      data-contact-channel={option.id}
                      onClick={() => updateField("deliveryChannel", option.id)}
                      className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
                        isSelected
                          ? "border-primary/70 bg-primary/15 text-foreground"
                          : "border-border/70 bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                      aria-pressed={isSelected}
                    >
                      <span className="block text-sm font-semibold">{option.label}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                        {option.description}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="contact-project-type" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Tipo de proyecto
              </Label>
              <select
                id="contact-project-type"
                name="projectType"
                value={formData.projectType}
                onChange={(event) => updateProjectType(event.target.value as ContactProjectType)}
                className="mt-2 h-12 w-full rounded-xl border border-border bg-card/80 px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
              >
                {contactProjectOptions.map((option) => (
                  <option key={option.id} value={option.id} className="bg-background text-foreground">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card/50 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-cyan" aria-hidden="true" />
              <span>Sin base de datos: email mediante Resend y WhatsApp preparado por enlace seguro.</span>
            </div>
          </div>

          <div className="min-w-0 space-y-5 rounded-[1.5rem] border border-white/10 bg-background/60 p-5 sm:p-6">
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
                  Email {sendsEmail ? "*" : ""}
                </Label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  required={sendsEmail}
                  autoComplete="email"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="mt-2 h-12 rounded-xl border-border bg-card/80"
                />
              </div>
            </div>

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

            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Label htmlFor="contact-message" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Mensaje editable *
                  </Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Guía activa: {selectedProject.label}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={useSuggestedMessage}
                  className="inline-flex items-center gap-2 self-start rounded-full border border-border/70 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Usar guía
                </button>
              </div>
              <Textarea
                id="contact-message"
                name="message"
                required
                minLength={10}
                value={formData.message}
                onChange={(event) => updateField("message", event.target.value)}
                className="mt-2 min-h-52 resize-y rounded-xl border-border bg-card/80 leading-relaxed"
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
                className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
                  status === "success"
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                    : "border-destructive/40 bg-destructive/10 text-foreground"
                }`}
                role="status"
                aria-live="polite"
              >
                <div className="flex items-start gap-3">
                  {status === "success" ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
                  )}
                  <span>{statusMessage}</span>
                </div>
                {preparedWhatsAppHref && (
                  <a
                    href={preparedWhatsAppHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/50"
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    Abrir WhatsApp
                  </a>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 rounded-xl px-6 text-sm font-semibold"
              >
                {isSubmitting ? (
                  "Preparando..."
                ) : (
                  <>
                    {sendsWhatsApp ? (
                      <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                    )}
                    {submitLabel}
                  </>
                )}
              </Button>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Canal seleccionado: {selectedDelivery?.label ?? "Email"}.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
