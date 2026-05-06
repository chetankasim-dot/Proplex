import 'server-only'
import { sql } from '@/lib/db'
import type { ProposalRow } from '@/lib/proposals'

export async function listProposals(workspaceId: string): Promise<ProposalRow[]> {
  const rows = await sql`
    SELECT id, title, client_name, industry, template, value, status, created_at
    FROM documents
    WHERE workspace_id = ${workspaceId}
      AND type = 'proposal'
    ORDER BY created_at DESC
  `
  return rows as ProposalRow[]
}
