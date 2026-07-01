export type AgentMessage = {
  role: "user" | "assistant"
  content: string
}

export type AgentHistoryMessage = AgentMessage

export type AgentWidgetTheme = {
  assistantAvatar?: string
  assistantBubble?: string
  floatingButton?: string
  floatingSparkle?: string
  header?: string
  input?: string
  micActive?: string
  micIdle?: string
  micPing?: string
  micUnsupported?: string
  onlineDot?: string
  panel?: string
  scrollHint?: string
  sendButton?: string
  unreadBadge?: string
  userBubble?: string
  voiceStatusActive?: string
}

export type AgentWidgetConfig = {
  apiEndpoint?: string
  assistantSubtitle: string
  assistantTitle: string
  brandName: string
  closeLabel?: string
  connectionErrorReply: string
  dialogLabel: string
  fallbackReply: string
  floatingButtonLabel: string
  floatingButtonText?: string
  inputMaxLength?: number
  listeningPlaceholder?: string
  maxHistoryItems?: number
  placeholder: string
  quoteRequest?: {
    apiEndpoint?: string
    buttonLabel?: string
    enabled?: boolean
  }
  sendLabel?: string
  sessionStorageKey: string
  showFloatingSparkle?: boolean
  theme?: AgentWidgetTheme
  unavailableVoiceMessage?: string
  voiceLanguage?: string
  welcomeMessage: string
}

export type AgentPromptOptions = {
  brandName: string
  instructions: string
}
