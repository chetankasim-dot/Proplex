export const PROPOSAL_STATUSES = [
  'Draft',
  'Consultant Review',
  'Business Review',
  'Management Review',
  'Approved',
  'Signed',
] as const

export type ProposalStatus = (typeof PROPOSAL_STATUSES)[number]

export const PROPOSAL_TEMPLATES = [
  'ESG Advisory Retainer',
  'Carbon Footprint & GHG',
  'ESG Strategy & Roadmap',
  'EcoVadis / Rating Improvement',
  'Supplier ESG Assessment',
  'Platform POC',
  'Platform Sales',
  'Channel Partnership',
] as const

export type ProposalTemplate = (typeof PROPOSAL_TEMPLATES)[number]

export const CLIENT_TIERS = ['SMB', 'Mid-Market', 'Enterprise'] as const
export type ClientTier = (typeof CLIENT_TIERS)[number]

export type ProposalRow = {
  id: string
  title: string
  client_name: string | null
  industry: string | null
  template: string | null
  value: string | null
  status: string
  created_at: string
}
