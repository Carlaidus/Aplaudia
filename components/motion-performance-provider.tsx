"use client"

import { MotionConfig, useReducedMotion } from "framer-motion"
import { useEffect, useState, type ReactNode } from "react"

const lightweightMotionQuery = "(max-width: 900px), (pointer: coarse)"

export function useLightweightMotion() {
  const prefersReducedMotion = useReducedMotion()
  const [matchesLightweightDevice, setMatchesLightweightDevice] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(lightweightMotionQuery)
    const update = () => setMatchesLightweightDevice(mediaQuery.matches)

    update()
    mediaQuery.addEventListener("change", update)

    return () => mediaQuery.removeEventListener("change", update)
  }, [])

  return Boolean(prefersReducedMotion || matchesLightweightDevice)
}

export function MotionPerformanceProvider({ children }: { children: ReactNode }) {
  const lightweightMotion = useLightweightMotion()

  return (
    <MotionConfig reducedMotion={lightweightMotion ? "always" : "user"}>
      {children}
    </MotionConfig>
  )
}
