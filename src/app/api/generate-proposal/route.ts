import Anthropic from '@anthropic-ai/sdk'
import { sql } from '@/lib/db'
import { getWorkspaceId } from '@/lib/workspace'
import { CLIENT_TIERS, PROPOSAL_TEMPLATES } from '@/lib/proposals'

export const runtime = 'nodejs'
export const maxDuration = 120

const PROPOSAL_SECTIONS = [
  'exec_summary',
  'client_profile',
  'industry_landscape',
  'benchmarking',
  'pain_points',
  'roi',
  'frameworks',
  'scope',
  'scope_exclusions',
  'approach',
  'timeline',
  'case_studies',
  'team',
  'milestones',
  'risks',
  'terms',
  'next_steps',
] as const

const SYSTEM_PROMPT = `You are an expert ESG consulting proposal writer working inside Proplex, a document intelligence platform for ESG consulting firms. You write professional, persuasive, evidence-grounded proposals.

Given client details and a template type, draft a complete proposal as a single JSON object.

OUTPUT FORMAT — non-negotiable:
Return one JSON object with EXACTLY these keys, in this order, and no others:
${PROPOSAL_SECTIONS.map((s) => `- ${s}`).join('\n')}

Each value must be a string. Markdown is allowed inside the strings (paragraphs, bullets with "-", sub-headings with "###"). Do NOT wrap the response in code fences. Do NOT add a preamble. Output must be a single JSON object that JSON.parse can read directly.

Tone: clear, confident, specific. Cite frameworks (GRI, SASB, TCFD, CSRD, EcoVadis, CDP, ISSB, SBTi, GHG Protocol) where they fit naturally. Calibrate depth to the client tier — SMB: lean and pragmatic; Mid-Market: structured and moderate; Enterprise: deep and rigorous.`

type FormBody = {
  client_name?: string
  industry?: string
  template?: string
  client_tier?: string
  context?: string
  prepared_by?: string
  value?: string
}

export async function POST(request: Request) {
  let workspaceId: string
  try {
    workspaceId = await getWorkspaceId()
  } catch {
    return Response.json({ error: 'Unauthenticated' }, { status: 401 })
  }

  let body: FormBody
  try {
    body = (await request.json()) as FormBody
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const client_name = (body.client_name ?? '').trim()
  if (!client_name) {
    return Response.json({ error: 'client_name is required' }, { status: 400 })
  }

  const template = body.template ?? ''
  if (!PROPOSAL_TEMPLATES.includes(template as (typeof PROPOSAL_TEMPLATES)[number])) {
    return Response.json({ error: 'Invalid template' }, { status: 400 })
  }

  const client_tier = body.client_tier ?? ''
  if (!CLIENT_TIERS.includes(client_tier as (typeof CLIENT_TIERS)[number])) {
    return Response.json({ error: 'Invalid client_tier' }, { status: 400 })
  }

  const industry = (body.industry ?? '').trim()
  const context = (body.context ?? '').trim()
  const prepared_by = (body.prepared_by ?? '').trim()
  const value = (body.value ?? '').trim()

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: 'ANTHROPIC_API_KEY is not configured on the server' },
      { status: 500 },
    )
  }

  const userPrompt = `Client: ${client_name}
Industry: ${industry || 'Not specified'}
Client tier: ${client_tier}
Template: ${template}
Value: ${value || 'TBD'}
Prepared by: ${prepared_by || 'The Proplex team'}

Context / challenge:
${context || '(none provided — make reasonable assumptions appropriate to the template)'}

Draft the proposal now.`

  let proposal: Record<string, string>
  try {
    const anthropic = new Anthropic()
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: userPrompt },
        { role: 'assistant', content: '{' },
      ],
    })

    const textParts: string[] = []
    for (const block of message.content) {
      if (block.type === 'text') textParts.push(block.text)
    }
    const raw = '{' + textParts.join('')

    try {
      proposal = JSON.parse(raw) as Record<string, string>
    } catch {
      return Response.json(
        { error: 'Model returned invalid JSON. Try again.' },
        { status: 502 },
      )
    }
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      return Response.json(
        { error: `Anthropic API error (${err.status}): ${err.message}` },
        { status: 502 },
      )
    }
    const msg = err instanceof Error ? err.message : 'Failed to call Anthropic'
    return Response.json({ error: msg }, { status: 500 })
  }

  const title = `${template} – ${client_name}`

  try {
    const rows = (await sql`
      INSERT INTO documents (
        workspace_id, type, title, client_name, industry, template,
        client_tier, context, prepared_by, value, status, generated_content
      ) VALUES (
        ${workspaceId}, 'proposal', ${title}, ${client_name}, ${industry || null},
        ${template}, ${client_tier}, ${context || null}, ${prepared_by || null},
        ${value || null}, 'Draft', ${JSON.stringify(proposal)}::jsonb
      )
      RETURNING id
    `) as Array<{ id: string }>
    return Response.json({ id: rows[0].id })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Database error'
    return Response.json({ error: `DB insert failed: ${msg}` }, { status: 500 })
  }
}
