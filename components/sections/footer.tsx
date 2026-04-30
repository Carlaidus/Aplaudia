"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import { useTranslations } from "@/i18n"

export function Footer() {
  const { t } = useTranslations("footer")
  const footerRef = useRef<HTMLElement>(null)
  const isInView = useInView(footerRef, { once: true, margin: "-50px" })

  const footerLinks = {
    servicios: [
      { labelKey: "services.websites", href: "#servicios" },
      { labelKey: "services.whatsapp", href: "#whatsapp" },
      { labelKey: "services.visuals", href: "#servicios" },
    ],
    empresa: [
      { labelKey: "company.process", href: "#proceso" },
      { labelKey: "company.portfolio", href: "#portafolio" },
      { labelKey: "company.about", href: "#nosotros" },
    ],
    contacto: [
      { labelKey: "contact.email", href: "mailto:carlosvfx@gmail.com", value: "carlosvfx@gmail.com" },
      { labelKey: "contact.whatsapp", href: "https://wa.me/521234567890", value: "WhatsApp" },
    ],
  }

  return (
    <footer ref={footerRef} className="relative bg-card border-t border-border overflow-hidden">
      {/* Animated top accent line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand section with staggered reveal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            {/* Logo with hover effect */}
            <Link 
              href="/" 
              className="group inline-flex items-center gap-2 text-2xl font-bold text-foreground"
            >
              <motion.span
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent-cyan"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
                transition={{ duration: 0.4 }}
              >
                <span className="text-lg font-bold text-foreground">A</span>
              </motion.span>
              <span className="group-hover:text-primary transition-colors">Aplaudia</span>
            </Link>
            
            <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t("description")}
            </p>
            
            {/* Social proof or tagline */}
            <motion.div 
              className="mt-6 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              <motion.span 
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs text-muted-foreground">{t("tagline")}</span>
            </motion.div>
          </motion.div>

          {/* Services links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-5">
              {t("servicesTitle")}
            </h3>
            <ul className="space-y-4">
              {footerLinks.servicios.map((link, index) => (
                <motion.li
                  key={link.labelKey}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="group text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                  >
                    <motion.span 
                      className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100"
                      initial={false}
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.3 }}
                    />
                    {t(link.labelKey)}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-5">
              {t("companyTitle")}
            </h3>
            <ul className="space-y-4">
              {footerLinks.empresa.map((link, index) => (
                <motion.li
                  key={link.labelKey}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="group text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                  >
                    <motion.span 
                      className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100"
                      initial={false}
                    />
                    {t(link.labelKey)}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-5">
              {t("contactTitle")}
            </h3>
            <ul className="space-y-4">
              {footerLinks.contacto.map((link, index) => (
                <motion.li
                  key={link.labelKey}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                  >
                    <motion.span 
                      className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100"
                      initial={false}
                    />
                    {link.value}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom section with animated divider */}
        <motion.div
          className="mt-16 pt-8 border-t border-border"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Aplaudia. {t("rights")}
            </p>
            <motion.p 
              className="text-sm text-muted-foreground flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <span>{t("madeWith")}</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-primary"
              >
                ♥
              </motion.span>
              <span>{t("madeIn")}</span>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
