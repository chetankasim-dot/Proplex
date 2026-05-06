export function PagePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto max-w-7xl">
      <div
        className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border bg-white p-10 text-center"
        style={{ borderColor: '#ECE9F5' }}
      >
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: 'rgba(110,92,255,0.1)', color: '#6E5CFF' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold" style={{ color: '#1A1240' }}>
          {title} coming soon
        </h2>
        <p className="mt-1 max-w-md text-sm" style={{ color: '#5C5485' }}>
          {description}
        </p>
      </div>
    </div>
  )
}
