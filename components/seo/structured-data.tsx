import { structuredData } from "@/content/seo"

export function StructuredData() {
  return (
    <script
      id="aplaudia-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
      }}
    />
  )
}
