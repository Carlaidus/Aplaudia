const cartuchos = [
  {
    name: "Directos",
    meta: "2 x 1",
    color: "text-cyan-300",
    border: "border-cyan-300/50",
    className: "md:col-span-2 ap-cartucho-demo-card--move",
  },
  {
    name: "Historias",
    meta: "1 x 1",
    color: "text-fuchsia-300",
    border: "border-fuchsia-300/50",
    className: "ap-cartucho-demo-card--lift",
  },
  {
    name: "Música",
    meta: "1 x 1",
    color: "text-amber-300",
    border: "border-amber-300/50",
    className: "ap-cartucho-demo-card--shift",
  },
  {
    name: "Eventos",
    meta: "2 x 1",
    color: "text-rose-300",
    border: "border-rose-300/50",
    className: "md:col-span-2 ap-cartucho-demo-card--expand",
  },
  {
    name: "Noticias",
    meta: "2 x 2",
    color: "text-sky-300",
    border: "border-sky-300/50",
    className: "md:col-span-2 md:row-span-2 ap-cartucho-demo-card--pulse",
  },
  {
    name: "Twitch",
    meta: "1 x 1",
    color: "text-violet-300",
    border: "border-violet-300/50",
    className: "ap-cartucho-demo-card--lift",
  },
]

export function CartuchoMotionDemo() {
  return (
    <section className="border-b border-border/60 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              Movimiento modular
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Los cartuchos no son solo enlaces
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              La home de Aventuras Pixeladas está preparada para reorganizar módulos,
              cambiar tamaños y guardar una composición distinta sin rehacer la página.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="ap-cartucho-demo-grid">
              {cartuchos.map((cartucho) => (
                <article
                  className={[
                    "ap-cartucho-demo-card",
                    cartucho.color,
                    cartucho.border,
                    cartucho.className,
                  ].join(" ")}
                  key={cartucho.name}
                >
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold tracking-tight">
                        {cartucho.name}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Tamaño {cartucho.meta}
                      </p>
                    </div>
                    <span className="h-3 w-3 shrink-0 rounded-full bg-current opacity-80" />
                  </div>
                  <div className="mt-5 h-2 rounded-full bg-secondary">
                    <div className="h-full w-2/3 rounded-full bg-current opacity-70" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
