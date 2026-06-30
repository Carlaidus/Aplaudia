"use client"

import { useState } from "react"
import { AlertCircle, Check, CheckCircle2, MessageCircle, RotateCcw, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  buildGuidedContactMessage,
  contactDeliveryOptions,
  contactNeeds,
  defaultContactDeliveryChannels,
  defaultContactNeedIds,
  getContactNeeds,
  type ContactDeliveryChannel,
  type ContactNeedId,
} from "@/content/contact"
import { siteConfig } from "@/content/site"

type FormState = {
  name: string
  email: string
  phone: string
  needs: ContactNeedId[]
  deliveryChannels: ContactDeliveryChannel[]
  message: string
  privacy: boolean
  website: string
}

function createInitialFormState(): FormState {
  const needs = [...defaultContactNeedIds]

  return {
    name: "",
    email: "",
    phone: "",
    needs,
    deliveryChannels: [...defaultContactDeliveryChannels],
    message: buildGuidedContactMessage(needs),
    privacy: false,
    website: "",
  }
}

function buildWhatsAppHref(formData: FormState) {
  const selectedNeeds = getContactNeeds(formData.needs)
  const needsText = selectedNeeds.length
    ? selectedNeeds.map((need) => `- ${need.label}`).join("\n")
    : "- Consulta general"
  const lines = [
    "Hola, Aplaudia. Quiero enviaros una consulta desde la web.",
    "",
    "Opciones marcadas:",
    needsText,
    "",
    formData.name.trim() ? `Nombre: ${formData.name.trim()}` : null,
    formData.email.trim() ? `Email: ${formData.email.trim()}` : null,
    formData.phone.trim() ? `Teléfono: ${formData.phone.trim()}` : null,
    "",
    "Mensaje:",
    formData.message.trim(),
  ].filter(Boolean)

  return `https://wa.me/${siteConfig.contact.whatsappInternational}?text=${encodeURIComponent(lines.join("\n"))}`
}

function getDeliveryChannelPayload(channels: ContactDeliveryChannel[]) {
  if (channels.includes("email") && channels.includes("whatsapp")) return "both"
  if (channels.includes("whatsapp")) return "whatsapp"
  return "email"
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormState>(() => createInitialFormState())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")
  const [preparedWhatsAppHref, setPreparedWhatsAppHref] = useState<string | null>(null)

  const sendsEmail = formData.deliveryChannels.includes("email")
  const sendsWhatsApp = formData.deliveryChannels.includes("whatsapp")

  const resetStatus = () => {
    if (status !== "idle") {
      setStatus("idle")
      setStatusMessage("")
      setPreparedWhatsAppHref(null)
    }
  }

  const updateField = <Field extends keyof FormState>(field: Field, value: FormState[Field]) => {
    setFormData((current) => ({ ...current, [field]: value }))
    resetStatus()
  }

  const toggleNeed = (needId: ContactNeedId) => {
    setFormData((current) => {
      const nextNeeds = current.needs.includes(needId)
        ? current.needs.filter((id) => id !== needId)
        : [...current.needs, needId]
      const currentSuggestion = buildGuidedContactMessage(current.needs)
      const nextSuggestion = buildGuidedContactMessage(nextNeeds)
      const shouldReplaceMessage =
        current.message.trim().length === 0 || current.message === currentSuggestion

      return {
        ...current,
        needs: nextNeeds,
        message: shouldReplaceMessage ? nextSuggestion : current.message,
      }
    })
    resetStatus()
  }

  const toggleDeliveryChannel = (channel: ContactDeliveryChannel) => {
    setFormData((current) => {
      const deliveryChannels = current.deliveryChannels.includes(channel)
        ? current.deliveryChannels.filter((id) => id !== channel)
        : [...current.deliveryChannels, channel]

      return { ...current, deliveryChannels }
    })
    resetStatus()
  }

  const updateSuggestedMessage = () => {
    setFormData((current) => ({
      ...current,
      message: buildGuidedContactMessage(current.needs),
    }))
    resetStatus()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (formData.needs.length === 0) {
      setStatus("error")
      setStatusMessage("Marca al menos una opción o selecciona Consulta general.")
      return
    }

    if (formData.deliveryChannels.length === 0) {
      setStatus("error")
      setStatusMessage("Selecciona Email, WhatsApp o ambos para enviar la consulta.")
      return
    }

    if (!formData.privacy) {
      setStatus("error")
      setStatusMessage("Acepta el uso de datos para que podamos responderte.")
      return
    }

    if (sendsEmail && !formData.email.trim()) {
      setStatus("error")
      setStatusMessage("El email es obligatorio si eliges enviar la consulta por correo.")
      return
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setStatus("error")
      setStatusMessage("Revisa el mensaje antes de enviarlo.")
      return
    }

    const whatsappHref = sendsWhatsApp ? buildWhatsAppHref(formData) : null
    let whatsappOpened = false

    setPreparedWhatsAppHref(whatsappHref)
    setIsSubmitting(true)
    setStatus("idle")
    setStatusMessage("")

    if (whatsappHref) {
      const popup = window.open(whatsappHref, "_blank", "noopener,noreferrer")
      whatsappOpened = Boolean(popup)
    }

    try {
      if (sendsEmail) {
        const response = await fetch("/api/contacto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            deliveryChannel: getDeliveryChannelPayload(formData.deliveryChannels),
          }),
        })
        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data.error ?? "No se ha podido enviar el mensaje por email.")
        }
      }

      if (sendsEmail && sendsWhatsApp) {
        setStatusMessage(
          whatsappOpened
            ? "Consulta enviada por email y WhatsApp preparado con tu mensaje."
            : "Consulta enviada por email. WhatsApp queda preparado en el enlace de confirmación.",
        )
      } else if (sendsEmail) {
        setStatusMessage("Consulta enviada por email. Te responderemos lo antes posible.")
        setFormData(createInitialFormState())
      } else {
        setStatusMessage(
          whatsappOpened
            ? "WhatsApp está preparado con tu mensaje. Revísalo antes de enviarlo."
            : "WhatsApp queda preparado en el enlace de confirmación.",
        )
      }

      setStatus("success")
    } catch (error) {
      setStatus("error")
      setStatusMessage(
        error instanceof Error
          ? `${error.message} Puedes enviar la consulta por WhatsApp si quieres contactar ahora.`
          : "No se ha podido enviar el email. Puedes enviar la consulta por WhatsApp si quieres contactar ahora.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div id="aplaudia-contact-form" className="mx-auto mt-12 max-w-5xl scroll-mt-28 text-left sm:scroll-mt-32">
      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-white/15 bg-card/75 p-4 shadow-2xl shadow-primary/10 backdrop-blur sm:p-6 lg:p-7"
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

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5 rounded-[1.5rem] border border-white/15 bg-background/80 p-5 sm:p-6">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Primero dime qué necesitas
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Marca una o varias opciones y prepararemos un mensaje que podrás editar antes de enviarlo.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80">
                Elige una o varias opciones
              </p>
              <div className="mt-3 grid gap-3" aria-label="Necesidades del proyecto">
                {contactNeeds.map((option) => {
                  const isSelected = formData.needs.includes(option.id)

                  return (
                    <button
                      key={option.id}
                      type="button"
                      data-contact-need={option.id}
                      onClick={() => toggleNeed(option.id)}
                      className={`flex min-h-14 items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/25 text-foreground shadow-lg shadow-primary/15"
                          : "border-white/20 bg-white/[0.06] text-foreground/88 hover:border-primary/60 hover:bg-primary/10"
                      }`}
                      aria-pressed={isSelected}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-white/35 bg-background/70"
                        }`}
                        aria-hidden="true"
                      >
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </span>
                      <span className="min-w-0">{option.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="min-w-0 space-y-5 rounded-[1.5rem] border border-white/15 bg-background/70 p-5 sm:p-6">
            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Label htmlFor="contact-message" className="text-xs uppercase tracking-[0.18em] text-foreground/80">
                  Mensaje
                </Label>
                <button
                  type="button"
                  onClick={updateSuggestedMessage}
                  className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Actualizar mensaje
                </button>
              </div>
              <Textarea
                id="contact-message"
                name="message"
                required
                minLength={10}
                value={formData.message}
                onChange={(event) => updateField("message", event.target.value)}
                className="mt-2 min-h-36 resize-y rounded-xl border-white/20 bg-card/80 leading-relaxed"
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80">
                Datos de contacto
              </p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
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
                    className="mt-2 h-12 rounded-xl border-white/20 bg-card/80"
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
                    className="mt-2 h-12 rounded-xl border-white/20 bg-card/80"
                  />
                </div>

                <div className="min-w-0 sm:col-span-2">
                  <Label htmlFor="contact-phone" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Teléfono opcional
                  </Label>
                  <Input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    className="mt-2 h-12 rounded-xl border-white/20 bg-card/80"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-white/18 bg-white/[0.05] px-4 py-3">
              <Checkbox
                id="contact-privacy"
                checked={formData.privacy}
                onCheckedChange={(checked) => updateField("privacy", checked === true)}
                className="mt-0.5 h-5 w-5 rounded-md border-2 border-primary/70 bg-background data-[state=checked]:border-primary data-[state=checked]:bg-primary"
              />
              <Label htmlFor="contact-privacy" className="text-sm leading-relaxed text-foreground/80">
                Acepto que Aplaudia use estos datos para responder a mi consulta.
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
                    className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/50"
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    Abrir WhatsApp
                  </a>
                )}
              </div>
            )}

            <div className="rounded-2xl border border-white/18 bg-white/[0.05] p-3">
              <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-foreground/80">
                ¿Cómo quieres enviarlo? Selecciona una o las dos opciones.
              </p>
              <div className="grid grid-cols-2 gap-2" aria-label="Canal de envío">
                {contactDeliveryOptions.map((option) => {
                  const isSelected = formData.deliveryChannels.includes(option.id)

                  return (
                    <button
                      key={option.id}
                      type="button"
                      data-contact-delivery={option.id}
                      onClick={() => toggleDeliveryChannel(option.id)}
                      className={`rounded-xl border-2 px-3 py-2.5 text-center text-sm font-semibold transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/25 text-foreground"
                          : "border-white/20 bg-background/60 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                      aria-pressed={isSelected}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl px-6 text-sm font-semibold"
            >
              {isSubmitting ? (
                "Preparando..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                  Enviar
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
