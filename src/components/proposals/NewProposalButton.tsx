'use client'

import { useState } from 'react'
import { NewProposalModal } from '@/components/proposals/NewProposalModal'

export function NewProposalButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #6E5CFF 0%, #A855F7 100%)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        New Proposal
      </button>
      {open && <NewProposalModal onClose={() => setOpen(false)} />}
    </>
  )
}
