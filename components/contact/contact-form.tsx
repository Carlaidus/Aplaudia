"use client"

import { useMemo, useState } from "react"
import { AlertCircle, Check, CheckCircle2, MessageCircle, RotateCcw, Send, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  buildGuidedContactMessage,
  contactDeliveryOptions,
  contactNeeds,
  defaultContactDeliveryChannel,
  defaultContactNeedIds,
  getContactDeliveryOption,
  getContactNeeds,
  type ContactDeliveryChannel,
  type ContactNeedId,
} from "@/content/contact"
import { siteConfig } from "@/content/site"

type FormState = {
  name: string
  email: string
  phone: string
  business: string
  needs: ContactNeedId[]
  deliveryChannel: ContactDeliveryChannel
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
    business: "",
    needs,
    deliveryChannel: defaultContactDeliveryChannel,
    message: buildGuidedContactMessage(needs),
    privacy: false,
    website: "",
  }
}

function buildWhatsAppHref(formData: FormState) {
  const selectedNeeds = getContactNeeds(formData.needs)
  const needsText = selectedNeeds.length
    ? selectedNeeds.map((need) => `- ${need.label}`).join("\n")
    : "- Sin necesidades marcadas"
  const lines = [
    "Hola, Aplaudia. He visto vuestra web y quiero comentar un proyecto digital.",
    "",
    "Necesidades:",
    needsText,
    "",
    formData.name.trim() ? `Nombre: ${formData.name.trim()}` : null,
    formData.business.trim() ? `Negocio o web: ${formData.business.trim()}` : null,
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

  const selectedNeeds = useMemo(() => getContactNeeds(formData.needs), [formData.needs])
  const selectedDelivery = useMemo(
    () => getContactDeliveryOption(formData.deliveryChannel),
    [formData.deliveryChannel],
  )
  const sendsEmail = formData.deliveryChannel === "email"
  const sendsWhatsApp = formData.deliveryChannel === "whatsapp"

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

  const useSuggestedMessage = () => {
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
      setStatusMessage("Marca al menos una necesidad o selecciona “No lo tengo claro”.")
      return
    }

    if (!formData.privacy) {
      setStatus("error")
      setStatusMessage("Acepta el uso de datos para que podamos responderte.")
      return
    }

    if (sendsEmail && !formData.email.trim()) {
      setStatus("error")
      setStatusMessage("El email es obligatorio si eliges recibir respuesta por correo.")
      return
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setStatus("error")
      setStatusMessage("Revisa el mensaje antes de enviarlo.")
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

        setStatusMessage("Consulta enviada por email. Te responderemos lo antes posible.")
        setFormData(createInitialFormState())
      }

      if (whatsappHref) {
        const popup = window.open(whatsappHref, "_blank", "noopener,noreferrer")
        if (!popup) {
          setStatusMessage("WhatsApp está preparado. Si no se ha abierto, usa el enlace de confirmación.")
        } else {
          setStatusMessage("WhatsApp está preparado con tu mensaje. Revísalo antes de enviarlo.")
        }
      }

      setStatus("success")
    } catch (error) {
      setStatus("error")
      setStatusMessage(
        error instanceof Error
          ? `${error.message} También puedes elegir WhatsApp y enviarlo ahora.`
          : "No se ha podido enviar el mensaje. También puedes elegir WhatsApp y enviarlo ahora.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div id="aplaudia-contact-form" className="mx-auto mt-14 max-w-5xl scroll-mt-28 text-left sm:scroll-mt-32">
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

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5 rounded-[1.5rem] border border-white/10 bg-background/70 p-5 sm:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Contacto guiado
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Primero dime qué necesitas.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Marca una o varias opciones. El mensaje se prepara con tu selección y lo puedes editar antes de enviarlo.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Necesidades
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
                      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                        isSelected
                          ? "border-primary/70 bg-primary/15 text-foreground"
                          : "border-border/70 bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                      aria-pressed={isSelected}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background/50"
                        }`}
                        aria-hidden="true"
                      >
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">{option.label}</span>
                        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                          {option.description}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card/50 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-cyan" aria-hidden="true" />
              <span>Sin base de datos: email mediante Resend o WhatsApp preparado con tu mensaje.</span>
            </div>
          </div>

          <div className="min-w-0 space-y-5 rounded-[1.5rem] border border-white/10 bg-background/60 p-5 sm:p-6">
            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Label htmlFor="contact-message" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Mensaje editable *
                  </Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Guía activa: {selectedNeeds.length} {selectedNeeds.length === 1 ? "necesidad" : "necesidades"}
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

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
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
                  <Label htmlFor="contact-business" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Negocio o web
                  </Label>
                  <Input
                    id="contact-business"
                    name="business"
                    type="text"
                    autoComplete="organization"
                    value={formData.business}
                    onChange={(event) => updateField("business", event.target.value)}
                    className="mt-2 h-12 rounded-xl border-border bg-card/80"
                  />
                </div>
              </div>
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

            <div className="rounded-2xl border border-border/70 bg-card/50 p-3">
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Canal de envío">
                {contactDeliveryOptions.map((option) => {
                  const isSelected = formData.deliveryChannel === option.id

                  return (
                    <button
                      key={option.id}
                      type="button"
                      data-contact-delivery={option.id}
                      onClick={() => updateField("deliveryChannel", option.id)}
                      className={`rounded-xl border px-3 py-2.5 text-center text-sm font-semibold transition-colors ${
                        isSelected
                          ? "border-primary/70 bg-primary/15 text-foreground"
                          : "border-transparent text-muted-foreground hover:bg-background/50 hover:text-foreground"
                      }`}
                      aria-pressed={isSelected}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
              <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
                {selectedDelivery.description}
              </p>
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
                  {sendsWhatsApp ? (
                    <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                  )}
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
