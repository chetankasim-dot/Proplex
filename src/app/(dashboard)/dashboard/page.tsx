type Kpi = {
  label: string
  value: number
  accent: string
  icon: React.ReactNode
}

const KPIS: Kpi[] = [
  {
    label: 'Total Documents',
    value: 0,
    accent: '#6E5CFF',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    label: 'Pending Review',
    value: 0,
    accent: '#F59E0B',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: 'Approved',
    value: 0,
    accent: '#10B981',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    label: 'Active Tenders',
    value: 0,
    accent: '#A855F7',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
]

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <p className="text-sm" style={{ color: '#5C5485' }}>
          A quick view of activity across your workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-lg border bg-white p-5"
            style={{ borderColor: '#ECE9F5' }}
          >
            <div className="flex items-start justify-between">
              <span className="text-sm font-medium" style={{ color: '#5C5485' }}>
                {kpi.label}
              </span>
              <span
                className="flex h-9 w-9 items-center justify-center rounded-md"
                style={{ background: `${kpi.accent}14`, color: kpi.accent }}
              >
                {kpi.icon}
              </span>
            </div>
            <div className="mt-4 text-3xl font-semibold tracking-tight" style={{ color: '#1A1240' }}>
              {kpi.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
