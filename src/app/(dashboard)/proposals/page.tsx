import { getWorkspaceId } from '@/lib/workspace'
import { listProposals } from '@/lib/proposals-server'
import { NewProposalButton } from '@/components/proposals/NewProposalButton'
import { ProposalsTable } from '@/components/proposals/ProposalsTable'

export const dynamic = 'force-dynamic'

export default async function ProposalsPage() {
  const workspaceId = await getWorkspaceId()
  const proposals = await listProposals(workspaceId)

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight" style={{ color: '#1A1240' }}>
            Proposals
          </h2>
          <p className="text-sm" style={{ color: '#5C5485' }}>
            Drafts, reviews, and signed agreements — all generated and tracked here.
          </p>
        </div>
        <NewProposalButton />
      </div>

      {proposals.length === 0 ? <EmptyState /> : <ProposalsTable proposals={proposals} />}
    </div>
  )
}

function EmptyState() {
  return (
    <div
      className="flex min-h-[320px] flex-col items-center justify-center rounded-lg border bg-white p-10 text-center"
      style={{ borderColor: '#ECE9F5' }}
    >
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
        style={{ background: 'rgba(110,92,255,0.1)', color: '#6E5CFF' }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="13" x2="15" y2="13" />
          <line x1="9" y1="17" x2="15" y2="17" />
        </svg>
      </div>
      <h3 className="text-base font-semibold" style={{ color: '#1A1240' }}>
        No proposals yet
      </h3>
      <p className="mt-1 text-sm" style={{ color: '#5C5485' }}>
        Create your first proposal.
      </p>
    </div>
  )
}
