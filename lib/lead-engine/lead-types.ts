export type LeadMessage = {
  role: "assistant" | "user"
  content: string
}

export type LeadDraft = {
  budget: string
  consentAccepted: boolean
  email: string
  hasAskedForBudget: boolean
  hasAskedForConsent: boolean
  hasAskedForEmail: boolean
  hasAskedForName: boolean
  interest: string
  isActive: boolean
  name: string
  phone: string
  projectType: string
  sent: boolean
  wantsClientCopy: boolean
}

export type LeadServiceId =
  | "agent"
  | "catalog"
  | "data"
  | "maintenance"
  | "panel"
  | "reminders"
  | "reservations"
  | "seo"
  | "users"
  | "visuals"
  | "web"
  | "webApp"

export type LeadProjectKind =
  | "catalog"
  | "generalWeb"
  | "landing"
  | "personal"
  | "petClinicTool"
  | "restaurant"
  | "undefined"
  | "visual"
  | "webApp"

export type LeadLabels = {
  fallbackProjectType: string
  fallbackService: string
  projectTypes: Record<LeadProjectKind, string>
  services: Record<LeadServiceId, string>
}

export type LeadPriceReference = {
  lines: string[]
  projectKinds: LeadProjectKind[]
  sensitivity?: "high" | "medium"
}

export type LeadEngineConfig = {
  brandName: string
  channelLabel: string
  consentText: string
  internalRecipientEnv: "AGENT_QUOTE_RECIPIENT_EMAIL" | "CONTACT_RECIPIENT_EMAIL"
  labels: LeadLabels
  publicEmail: string
  priceReferences: LeadPriceReference[]
  sendClientCopyAutomatically: false
}

export type ClassifiedLeadMessages = {
  adminMessages: string[]
  contactMessages: string[]
  projectContextMessages: string[]
  userMessages: string[]
}

export type LeadCommercialSignals = {
  clarity?: string
  friction?: string
  nextAction: string
  priceSensitivity?: string
  timeline?: string
  urgency?: string
}

export type LeadAnalysis = {
  budgetLabel: string
  classifiedMessages: ClassifiedLeadMessages
  clientOnlyText: string
  commercialSignals: LeadCommercialSignals
  contact: {
    consentAccepted: boolean
    email: string
    name: string
    phone: string
  }
  materials: string[]
  objective: string
  priceLines: string[]
  projectContextText: string
  projectKind: LeadProjectKind
  projectType: string
  questions: string[]
  requestedServices: string[]
  summaryForReply: string
  usefulClientPhrases: string[]
}

export type InternalLeadEmail = {
  html: string
  subject: string
  text: string
}
