"use client"

import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Wand2, Image as ImageIcon, RefreshCw, Tv, Sparkles } from "lucide-react"
import { useTranslations } from "@/i18n"

type CategoryKey = "category1" | "category2" | "category3" | "category4"

const categoryIcons = {
  category1: Wand2,
  category2: ImageIcon,
  category3: RefreshCw,
  category4: Tv,
}

const categoryAccents: Record<CategoryKey, string> = {
  category1: "from-primary to-accent-cyan",
  category2: "from-accent-cyan to-accent-violet",
  category3: "from-accent-violet to-accent-magenta",
  category4: "from-accent-magenta to-primary",
}

// Gallery items with varied layouts
const galleryItems = [
  { id: 1, aspect: "aspect-[4/5]", span: "md:col-span-1 md:row-span-2", gradient: "from-primary/20 to-accent-cyan/20" },
  { id: 2, aspect: "aspect-video", span: "md:col-span-1", gradient: "from-accent-cyan/20 to-accent-violet/20" },
  { id: 3, aspect: "aspect-square", span: "md:col-span-1", gradient: "from-accent-violet/20 to-accent-magenta/20" },
  { id: 4, aspect: "aspect-[3/4]", span: "md:col-span-1 md:row-span-2", gradient: "from-accent-magenta/20 to-primary/20" },
  { id: 5, aspect: "aspect-video", span: "md:col-span-2", gradient: "from-primary/10 via-accent-cyan/10 to-accent-violet/10" },
]

function CategoryCard({ categoryKey, index }: { categoryKey: CategoryKey; index: number }) {
  const { t } = useTranslations("visualGallery")
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [isHovered, setIsHovered] = useState(false)
  
  const Icon = categoryIcons[categoryKey]
  const accent = categoryAccents[categoryKey]

  // Different entrance per card: rotate, scale, slide from corners
  const getEntrance = () => {
    switch (index) {
      case 0: return { x: -50, rotate: -5, opacity: 0 }
      case 1: return { y: -50, scale: 0.8, opacity: 0 }
      case 2: return { y: 50, scale: 0.8, opacity: 0 }
      case 3: return { x: 50, rotate: 5, opacity: 0 }
      default: return { opacity: 0 }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={getEntrance()}
      animate={isInView ? { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 } : {}}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Floating background glow */}
      <motion.div 
        className={`absolute -inset-2 bg-gradient-to-br ${accent} rounded-2xl opacity-0 blur-xl`}
        animate={{ opacity: isHovered ? 0.3 : 0 }}
        transition={{ duration: 0.4 }}
      />
      
      <div className="relative rounded-xl bg-card/60 backdrop-blur border border-border group-hover:border-primary/30 transition-all duration-300 p-6 h-full overflow-hidden">
        {/* Icon with 3D rotation on hover */}
        <motion.div 
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-foreground mb-4`}
          animate={{ 
            rotateY: isHovered ? 180 : 0,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <Icon className="h-7 w-7" style={{ backfaceVisibility: "hidden" }} />
        </motion.div>
        
        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-2">
          {t(`${categoryKey}.title`)}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t(`${categoryKey}.description`)}
        </p>
        
        {/* Expanding line from bottom */}
        <motion.div
          className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${accent}`}
          initial={{ width: 0 }}
          animate={{ width: isHovered ? "100%" : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  )
}

function GalleryItem({ item, index }: { item: typeof galleryItems[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [isHovered, setIsHovered] = useState(false)

  // Masonry-style staggered reveal with rotation
  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        scale: 0.7,
        rotateZ: index % 2 === 0 ? -8 : 8,
        y: 60,
      }}
      animate={isInView ? { 
        opacity: 1, 
        scale: 1,
        rotateZ: 0,
        y: 0,
      } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.12,
        type: "spring",
        stiffness: 80,
        damping: 15,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${item.span} ${item.aspect} rounded-2xl overflow-hidden group relative cursor-pointer`}
    >
      {/* Animated gradient background */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`}
        animate={{
          backgroundPosition: isHovered ? ["0% 0%", "100% 100%"] : "0% 0%",
        }}
        transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
        style={{ backgroundSize: "200% 200%" }}
      />
      
      {/* Overlay pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-30" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-6">
        <motion.div
          animate={{ 
            rotate: isHovered ? [0, 360] : 0,
            scale: isHovered ? 1.2 : 1,
          }}
          transition={{ duration: isHovered ? 20 : 0.3, ease: "linear", repeat: isHovered ? Infinity : 0 }}
        >
          <Sparkles className="w-10 h-10 text-foreground/60" />
        </motion.div>
        
        <motion.span 
          className="mt-3 text-sm font-medium text-foreground/70"
          animate={{ y: isHovered ? -5 : 0, opacity: isHovered ? 1 : 0.7 }}
          transition={{ duration: 0.2 }}
        >
          Visual {item.id}
        </motion.span>
      </div>
      
      {/* Hover border effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-primary/50"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 1.1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

export function VisualGallery() {
  const { t } = useTranslations("visualGallery")
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" })
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  
  // Parallax for decorative elements
  const decorY1 = useTransform(scrollYProgress, [0, 1], [0, -150])
  const decorY2 = useTransform(scrollYProgress, [0, 1], [0, 150])
  const decorRotate = useTransform(scrollYProgress, [0, 1], [0, 180])

  const categoryKeys: CategoryKey[] = ["category1", "category2", "category3", "category4"]

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-40 overflow-hidden">
      {/* Animated floating decorative elements */}
      <motion.div
        className="absolute top-20 -right-20 w-80 h-80 border border-primary/10 rounded-full"
        style={{ y: decorY1, rotate: decorRotate }}
      />
      <motion.div
        className="absolute bottom-40 -left-32 w-64 h-64 border border-accent-cyan/10 rounded-full"
        style={{ y: decorY2 }}
      />
      
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-cyan rounded-full mix-blend-screen opacity-5 blur-[150px]"
          animate={{ y: [0, 50, 0], x: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-accent-violet rounded-full mix-blend-screen opacity-5 blur-[120px]"
          animate={{ y: [0, -40, 0], x: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header with perspective animation */}
        <motion.div
          ref={headerRef}
          className="mx-auto max-w-3xl text-center mb-20"
          style={{ perspective: "1000px" }}
        >
          {/* Badge with horizontal expansion */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isHeaderInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <motion.div 
              className="h-px bg-gradient-to-r from-transparent to-primary"
              initial={{ width: 0 }}
              animate={isHeaderInView ? { width: 48 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              {t("badge")}
            </span>
            <motion.div 
              className="h-px bg-gradient-to-l from-transparent to-primary"
              initial={{ width: 0 }}
              animate={isHeaderInView ? { width: 48 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </motion.div>
          
          {/* Title with 3D entrance */}
          <motion.h2 
            className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-6"
            initial={{ opacity: 0, rotateX: -20, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, rotateX: 0, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {t("title")}{" "}
            <span className="text-gradient-blue-cyan">{t("titleHighlight")}</span>{" "}
            {t("titleEnd")}
          </motion.h2>
          
          <motion.p 
            className="text-lg text-muted-foreground text-pretty"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {t("subtitle")}
          </motion.p>
        </motion.div>

        {/* Categories with corner entrances */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-20">
          {categoryKeys.map((key, index) => (
            <CategoryCard key={key} categoryKey={key} index={index} />
          ))}
        </div>

        {/* Animated divider */}
        <motion.div
          className="flex items-center gap-4 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="h-px flex-1 bg-gradient-to-r from-border to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "left" }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5 text-primary" />
          </motion.div>
          <motion.div 
            className="h-px flex-1 bg-gradient-to-l from-border to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "right" }}
          />
        </motion.div>

        {/* Gallery grid with masonry-style reveals */}
        <div className="grid gap-6 md:grid-cols-3 md:grid-rows-3">
          {galleryItems.map((item, index) => (
            <GalleryItem key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
