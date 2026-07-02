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
  hasAskedForOptionalContact: boolean
  interest: string
  isActive: boolean
  leadStartedAtMessageIndex: number | null
  name: string
  optionalContactAskCount: number
  phone: string
  projectType: string
  sent: boolean
  wantsClientCopy: boolean
}

export type LeadOptionalContactPrompt = {
  allowPhoneCall?: boolean
  askName?: boolean
  askPhone?: boolean
  enabled: boolean
  maxAskCount?: number
  text: string
}

export type LeadServiceId =
  | "agentWeb"
  | "automation"
  | "catalog"
  | "data"
  | "database"
  | "documents"
  | "events"
  | "forms"
  | "institutionalWeb"
  | "maintenance"
  | "multiMunicipality"
  | "panel"
  | "reminders"
  | "reservations"
  | "seo"
  | "socialPublishing"
  | "users"
  | "visuals"
  | "web"
  | "webApp"
  | "whatsapp"

export type LeadProjectKind =
  | "catalog"
  | "generalWeb"
  | "landing"
  | "municipalInstitutional"
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
  leadOptionalContactPrompt?: LeadOptionalContactPrompt
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
  complexity?: string
  friction?: string
  nextAction: string
  priceConcern?: string
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
