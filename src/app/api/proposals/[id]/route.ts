import { sql } from '@/lib/db'
import { getWorkspaceId } from '@/lib/workspace'

export const runtime = 'nodejs'

const SECTION_KEY = /^[a-z][a-z0-9_]*$/

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  let workspaceId: string
  try {
    workspaceId = await getWorkspaceId()
  } catch {
    return Response.json({ error: 'Unauthenticated' }, { status: 401 })
  }

  const { id } = await params

  let body: { section?: unknown; value?: unknown }
  try {
    body = (await request.json()) as { section?: unknown; value?: unknown }
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const section = typeof body.section === 'string' ? body.section : ''
  if (!section || !SECTION_KEY.test(section)) {
    return Response.json({ error: 'Invalid section key' }, { status: 400 })
  }
  if (typeof body.value !== 'string') {
    return Response.json({ error: 'value must be a string' }, { status: 400 })
  }

  const path = `{${section}}`
  const value = body.value

  try {
    const rows = (await sql`
      UPDATE documents
      SET generated_content = jsonb_set(
            coalesce(generated_content, '{}'::jsonb),
            ${path}::text[],
            ${JSON.stringify(value)}::jsonb,
            true
          ),
          updated_at = now()
      WHERE id = ${id}
        AND workspace_id = ${workspaceId}
        AND type = 'proposal'
      RETURNING id
    `) as Array<{ id: string }>

    if (rows.length === 0) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }
    return Response.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Database error'
    return Response.json({ error: `DB update failed: ${msg}` }, { status: 500 })
  }
}
