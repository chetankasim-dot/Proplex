'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CLIENT_TIERS, PROPOSAL_TEMPLATES, type ClientTier, type ProposalTemplate } from '@/lib/proposals'

type FormState = {
  client_name: string
  industry: string
  template: ProposalTemplate
  client_tier: ClientTier
  context: string
  prepared_by: string
  value: string
}

const INITIAL: FormState = {
  client_name: '',
  industry: '',
  template: PROPOSAL_TEMPLATES[0],
  client_tier: 'Mid-Market',
  context: '',
  prepared_by: '',
  value: '',
}

export function NewProposalModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(INITIAL)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !submitting) onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [submitting, onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.client_name.trim()) {
      setError('Client name is required.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || `Request failed (${res.status})`)
      }
      const data = (await res.json()) as { id: string }
      router.push(`/proposals/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate proposal')
      setSubmitting(false)
    }
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,5,40,0.55)' }}
      onClick={() => !submitting && onClose()}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: '#ECE9F5' }}>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: '#1A1240' }}>
              New Proposal
            </h2>
            <p className="text-xs" style={{ color: '#7a72a8' }}>
              Claude will draft a full proposal from these inputs.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-md p-1 transition-colors hover:bg-[#F4F1FA] disabled:opacity-50"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C5485" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Client name" required>
              <Input
                value={form.client_name}
                onChange={(v) => update('client_name', v)}
                placeholder="Acme Corp"
                required
              />
            </Field>
            <Field label="Industry">
              <Input
                value={form.industry}
                onChange={(v) => update('industry', v)}
                placeholder="Manufacturing"
              />
            </Field>

            <Field label="Template">
              <Select
                value={form.template}
                onChange={(v) => update('template', v as ProposalTemplate)}
                options={[...PROPOSAL_TEMPLATES]}
              />
            </Field>
            <Field label="Value">
              <Input
                value={form.value}
                onChange={(v) => update('value', v)}
                placeholder="$120,000"
              />
            </Field>

            <Field label="Client tier" className="sm:col-span-2">
              <div className="flex gap-2">
                {CLIENT_TIERS.map((tier) => {
                  const active = form.client_tier === tier
                  return (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => update('client_tier', tier)}
                      className="flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors"
                      style={
                        active
                          ? { borderColor: '#6E5CFF', background: 'rgba(110,92,255,0.1)', color: '#1A1240' }
                          : { borderColor: '#E4E0F0', background: '#ffffff', color: '#5C5485' }
                      }
                    >
                      {tier}
                    </button>
                  )
                })}
              </div>
            </Field>

            <Field label="Prepared by">
              <Input
                value={form.prepared_by}
                onChange={(v) => update('prepared_by', v)}
                placeholder="Your name"
              />
            </Field>
            <Field label="" />

            <Field label="Context / challenge" className="sm:col-span-2">
              <textarea
                value={form.context}
                onChange={(e) => update('context', e.target.value)}
                placeholder="Background, the client's challenge, any specifics Claude should weave into the draft..."
                rows={5}
                className="w-full resize-none rounded-md border px-3 py-2 text-sm outline-none focus:border-[#6E5CFF]"
                style={{ borderColor: '#E4E0F0', color: '#1A1240' }}
              />
            </Field>
          </div>

          {error && (
            <div
              className="mt-4 rounded-md border px-3 py-2 text-sm"
              style={{ borderColor: '#FCA5A5', background: '#FEF2F2', color: '#B91C1C' }}
            >
              {error}
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-[#F4F1FA] disabled:opacity-50"
              style={{ borderColor: '#E4E0F0', color: '#1A1240' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #6E5CFF 0%, #A855F7 100%)' }}
            >
              {submitting ? (
                <>
                  <Spinner /> Generating…
                </>
              ) : (
                'Generate Proposal'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  label,
  required,
  className = '',
  children,
}: {
  label: string
  required?: boolean
  className?: string
  children?: React.ReactNode
}) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-1 block text-xs font-medium" style={{ color: '#5C5485' }}>
          {label}
          {required && <span className="ml-0.5" style={{ color: '#DC2626' }}>*</span>}
        </span>
      )}
      {children}
    </label>
  )
}

function Input({
  value,
  onChange,
  placeholder,
  required,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#6E5CFF]"
      style={{ borderColor: '#E4E0F0', color: '#1A1240' }}
    />
  )
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-[#6E5CFF]"
      style={{ borderColor: '#E4E0F0', color: '#1A1240' }}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  )
}

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="animate-spin">
      <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
