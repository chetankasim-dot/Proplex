'use client'

import { useRef, useState } from 'react'

export type Section = { key: string; label: string; content: string }

export function ProposalSections({
  proposalId,
  initialSections,
}: {
  proposalId: string
  initialSections: Section[]
}) {
  const [sections, setSections] = useState(initialSections)

  return (
    <div className="space-y-4">
      {sections.map((section, idx) => (
        <SectionCard
          key={section.key}
          proposalId={proposalId}
          section={section}
          onSaved={(next) => {
            setSections((prev) => {
              const copy = [...prev]
              copy[idx] = { ...copy[idx], content: next }
              return copy
            })
          }}
        />
      ))}
    </div>
  )
}

function SectionCard({
  proposalId,
  section,
  onSaved,
}: {
  proposalId: string
  section: Section
  onSaved: (content: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  function handleEdit() {
    setEditing(true)
    setError(null)
    requestAnimationFrame(() => {
      editorRef.current?.focus()
    })
  }

  async function handleSave() {
    const next = editorRef.current?.innerText ?? ''
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/proposals/${proposalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: section.key, value: next }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? `Save failed (${res.status})`)
      }
      onSaved(next)
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-lg border bg-white p-6" style={{ borderColor: '#ECE9F5' }}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold" style={{ color: '#1A1240' }}>
          {section.label}
        </h3>
        {!editing ? (
          <button
            type="button"
            onClick={handleEdit}
            className="rounded-md border px-3 py-1.5 text-xs font-medium transition hover:bg-[#FAFAFE]"
            style={{ borderColor: '#ECE9F5', color: '#1A1240' }}
          >
            Edit
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-white transition disabled:opacity-60"
            style={{ background: '#6E5CFF' }}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        )}
      </div>

      <div
        ref={editorRef}
        contentEditable={editing}
        suppressContentEditableWarning
        className="text-sm leading-relaxed outline-none"
        style={{
          color: '#1A1240',
          whiteSpace: 'pre-wrap',
          minHeight: editing ? '4rem' : undefined,
          background: editing ? '#FAFAFE' : undefined,
          borderRadius: editing ? 6 : undefined,
          padding: editing ? '0.5rem 0.75rem' : undefined,
          border: editing ? '1px solid #ECE9F5' : undefined,
        }}
      >
        {section.content}
      </div>

      {error ? (
        <p className="mt-2 text-xs" style={{ color: '#B91C1C' }}>
          {error}
        </p>
      ) : null}
    </div>
  )
}
