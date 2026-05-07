import Link from 'next/link'
import { notFound } from 'next/navigation'
import { sql } from '@/lib/db'
import { getWorkspaceId } from '@/lib/workspace'
import { StatusBadge } from '@/components/proposals/StatusBadge'
import { ProposalSections, type Section } from '@/components/proposals/ProposalSections'

export const dynamic = 'force-dynamic'

const SECTION_LABELS: Record<string, string> = {
  exec_summary: 'Executive Summary',
  scope: 'Scope',
  commercials: 'Commercials',
  next_steps: 'Next Steps',
  pain_points: 'Pain Points',
  approach: 'Approach',
  timeline: 'Timeline',
  client_profile: 'Client Profile',
  industry_landscape: 'Industry Landscape',
  benchmarking: 'Benchmarking',
  roi: 'ROI',
  frameworks: 'Frameworks',
  scope_exclusions: 'Scope Exclusions',
  case_studies: 'Case Studies',
  team: 'Team',
  milestones: 'Milestones',
  risks: 'Risks',
  terms: 'Terms',
}

const SECTION_ORDER = ['exec_summary', 'scope', 'commercials', 'next_steps']

function prettifyKey(key: string) {
  return key
    .split('_')
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ''))
    .join(' ')
}

type Row = {
  id: string
  title: string
  client_name: string | null
  status: string
  generated_content: Record<string, unknown> | null
}

export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const workspaceId = await getWorkspaceId()

  const rows = (await sql`
    SELECT id, title, client_name, status, generated_content
    FROM documents
    WHERE id = ${id}
      AND workspace_id = ${workspaceId}
      AND type = 'proposal'
    LIMIT 1
  `) as Row[]

  const row = rows[0]
  if (!row) notFound()

  const content = (row.generated_content ?? {}) as Record<string, unknown>

  const seen = new Set<string>()
  const ordered: string[] = []
  for (const key of SECTION_ORDER) {
    if (key in content) {
      ordered.push(key)
      seen.add(key)
    }
  }
  for (const key of Object.keys(content)) {
    if (!seen.has(key)) {
      ordered.push(key)
      seen.add(key)
    }
  }

  const sections: Section[] = ordered.map((key) => {
    const raw = content[key]
    return {
      key,
      label: SECTION_LABELS[key] ?? prettifyKey(key),
      content: typeof raw === 'string' ? raw : JSON.stringify(raw, null, 2),
    }
  })

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <Link
          href="/proposals"
          className="inline-flex items-center gap-1.5 text-xs font-medium hover:underline"
          style={{ color: '#5C5485' }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to proposals
        </Link>
      </div>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2
            className="truncate text-xl font-semibold tracking-tight"
            style={{ color: '#1A1240' }}
          >
            {row.title}
          </h2>
          <p className="mt-1 text-sm" style={{ color: '#5C5485' }}>
            {row.client_name ?? 'No client'}
          </p>
        </div>
        <div className="shrink-0">
          <StatusBadge status={row.status} />
        </div>
      </div>

      {sections.length === 0 ? (
        <div
          className="rounded-lg border bg-white p-10 text-center text-sm"
          style={{ borderColor: '#ECE9F5', color: '#5C5485' }}
        >
          No content has been generated for this proposal yet.
        </div>
      ) : (
        <ProposalSections proposalId={row.id} initialSections={sections} />
      )}
    </div>
  )
}
