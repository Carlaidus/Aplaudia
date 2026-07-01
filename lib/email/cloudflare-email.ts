const CLOUDFLARE_EMAIL_SEND_ENDPOINT = "https://api.cloudflare.com/client/v4/accounts"
const DEFAULT_INTERNAL_EMAIL_RECIPIENT = "carlosvfx@gmail.com"
const DEFAULT_EMAIL_FROM = "hola@aplaudia.com"

type CloudflareNamedAddress = {
  address: string
  name?: string
}

type CloudflareEmailAddress = string | CloudflareNamedAddress

type CloudflareEmailError = {
  code?: number
  message?: string
}

type CloudflareEmailResponse = {
  errors?: CloudflareEmailError[]
  messages?: unknown[]
  result?: {
    delivered?: string[]
    permanent_bounces?: string[]
    queued?: string[]
  } | null
  success?: boolean
}

export type SendInternalEmailInput = {
  html: string
  replyTo?: string
  subject: string
  text: string
  to: string
}

export class CloudflareEmailConfigurationError extends Error {
  constructor(message = "Cloudflare Email Service no esta configurado todavia.") {
    super(message)
    this.name = "CloudflareEmailConfigurationError"
  }
}

export class CloudflareEmailSendError extends Error {
  constructor(message = "Cloudflare Email Service no ha podido enviar el email.") {
    super(message)
    this.name = "CloudflareEmailSendError"
  }
}

function normalizeText(value: string | undefined) {
  return value?.trim() ?? ""
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function parseEmailAddress(value: string): CloudflareEmailAddress {
  const clean = value.trim()
  const match = clean.match(/^(.+?)\s*<([^<>]+)>$/)

  if (!match) return clean

  const name = match[1]?.trim().replace(/^["']|["']$/g, "")
  const address = match[2]?.trim()

  if (!address) return clean

  return name ? { address, name } : address
}

function getAddressValue(address: CloudflareEmailAddress) {
  return typeof address === "string" ? address : address.address
}

function getAllowedInternalRecipients() {
  return new Set(
    [
      DEFAULT_INTERNAL_EMAIL_RECIPIENT,
      process.env.INTERNAL_EMAIL_RECIPIENT,
      process.env.AGENT_QUOTE_RECIPIENT_EMAIL,
      process.env.CONTACT_RECIPIENT_EMAIL,
      process.env.CONTACT_TO_EMAIL,
    ]
      .map(normalizeText)
      .filter(Boolean)
      .map((email) => email.toLowerCase()),
  )
}

function getCloudflareEmailConfig() {
  const accountId = normalizeText(process.env.CLOUDFLARE_ACCOUNT_ID)
  const apiToken = normalizeText(process.env.CLOUDFLARE_EMAIL_API_TOKEN)
  const from = parseEmailAddress(normalizeText(process.env.EMAIL_FROM) || DEFAULT_EMAIL_FROM)
  const fromAddress = getAddressValue(from)

  if (!accountId || !apiToken) {
    throw new CloudflareEmailConfigurationError()
  }

  if (!isValidEmail(fromAddress)) {
    throw new CloudflareEmailConfigurationError("EMAIL_FROM no es una direccion valida.")
  }

  return {
    accountId,
    apiToken,
    from,
  }
}

export function getInternalEmailRecipient(primaryEnvName?: "AGENT_QUOTE_RECIPIENT_EMAIL" | "CONTACT_RECIPIENT_EMAIL") {
  const primary = primaryEnvName ? normalizeText(process.env[primaryEnvName]) : ""
  const recipient =
    primary ||
    normalizeText(process.env.INTERNAL_EMAIL_RECIPIENT) ||
    normalizeText(process.env.CONTACT_RECIPIENT_EMAIL) ||
    normalizeText(process.env.CONTACT_TO_EMAIL) ||
    DEFAULT_INTERNAL_EMAIL_RECIPIENT

  if (!isValidEmail(recipient)) {
    throw new CloudflareEmailConfigurationError("El destinatario interno de email no es valido.")
  }

  if (!getAllowedInternalRecipients().has(recipient.toLowerCase())) {
    throw new CloudflareEmailConfigurationError("El destinatario no esta permitido como email interno.")
  }

  return recipient
}

export async function sendInternalEmail({ html, replyTo, subject, text, to }: SendInternalEmailInput) {
  const config = getCloudflareEmailConfig()

  if (!isValidEmail(to)) {
    throw new CloudflareEmailConfigurationError("El destinatario interno de email no es valido.")
  }

  if (!getAllowedInternalRecipients().has(to.toLowerCase())) {
    throw new CloudflareEmailConfigurationError("El destinatario no esta permitido como email interno.")
  }

  const cleanReplyTo = normalizeText(replyTo)
  const payload: Record<string, unknown> = {
    from: config.from,
    html,
    subject,
    text,
    to,
  }

  if (cleanReplyTo && isValidEmail(cleanReplyTo)) {
    payload.reply_to = cleanReplyTo
  }

  const response = await fetch(`${CLOUDFLARE_EMAIL_SEND_ENDPOINT}/${config.accountId}/email/sending/send`, {
    body: JSON.stringify(payload),
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  })

  const data = (await response.json().catch(() => null)) as CloudflareEmailResponse | null

  if (!response.ok || data?.success !== true) {
    const message =
      data?.errors
        ?.map((error) => error.message)
        .filter(Boolean)
        .join("; ") || `Cloudflare Email Service respondio con HTTP ${response.status}.`

    throw new CloudflareEmailSendError(message)
  }

  return data.result ?? null
}
