import Link from 'next/link'
import { StatusBadge } from '@/components/proposals/StatusBadge'
import type { ProposalRow } from '@/lib/proposals'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export function ProposalsTable({ proposals }: { proposals: ProposalRow[] }) {
  return (
    <div
      className="overflow-hidden rounded-lg border bg-white"
      style={{ borderColor: '#ECE9F5' }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: '#FAFAFE', color: '#5C5485' }}>
            <Th>Document title</Th>
            <Th>Client</Th>
            <Th>Industry</Th>
            <Th>Template</Th>
            <Th>Value</Th>
            <Th>Date created</Th>
            <Th>Status</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {proposals.map((p, i) => (
            <tr
              key={p.id}
              style={{
                borderTop: i === 0 ? 'none' : '1px solid #F1EEF8',
                color: '#1A1240',
              }}
            >
              <Td>
                <Link
                  href={`/proposals/${p.id}`}
                  className="font-medium hover:underline"
                  style={{ color: '#1A1240' }}
                >
                  {p.title}
                </Link>
              </Td>
              <Td>{p.client_name ?? '—'}</Td>
              <Td>{p.industry ?? '—'}</Td>
              <Td>{p.template ?? '—'}</Td>
              <Td>{p.value ?? '—'}</Td>
              <Td>{dateFormatter.format(new Date(p.created_at))}</Td>
              <Td>
                <StatusBadge status={p.status} />
              </Td>
              <Td className="text-right">
                <Link
                  href={`/proposals/${p.id}`}
                  className="text-xs font-medium hover:underline"
                  style={{ color: '#6E5CFF' }}
                >
                  View →
                </Link>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  )
}

function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>
}
