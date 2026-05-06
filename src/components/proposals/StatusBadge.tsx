type Palette = { bg: string; fg: string; dot: string }

const STATUS_STYLES: Record<string, Palette> = {
  Draft:                { bg: '#F1F1F4', fg: '#4B5563', dot: '#9CA3AF' },
  'Consultant Review':  { bg: '#DBEAFE', fg: '#1D4ED8', dot: '#3B82F6' },
  'Business Review':    { bg: '#FEF3C7', fg: '#B45309', dot: '#F59E0B' },
  'Management Review':  { bg: '#EDE9FE', fg: '#6D28D9', dot: '#8B5CF6' },
  Approved:             { bg: '#D1FAE5', fg: '#047857', dot: '#10B981' },
  Signed:               { bg: '#A7F3D0', fg: '#065F46', dot: '#059669' },
}

const FALLBACK: Palette = { bg: '#F1F1F4', fg: '#4B5563', dot: '#9CA3AF' }

export function StatusBadge({ status }: { status: string }) {
  const palette = STATUS_STYLES[status] ?? FALLBACK
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: palette.bg, color: palette.fg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: palette.dot }} />
      {status}
    </span>
  )
}
