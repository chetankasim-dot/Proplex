'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

const ROLES = ['Agent', 'Consultant', 'Business Lead', 'Management'] as const
type Role = (typeof ROLES)[number]

const TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/proposals': 'Proposals',
  '/ndas': 'NDAs',
  '/quotes': 'Quotes',
  '/contracts': 'Contracts',
  '/tenders': 'Tenders',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
}

function titleFor(pathname: string): string {
  for (const path in TITLES) {
    if (pathname === path || pathname.startsWith(path + '/')) return TITLES[path]
  }
  return 'Proplex'
}

export function TopBar() {
  const pathname = usePathname()
  const [role, setRole] = useState<Role>('Agent')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    <header
      className="flex h-16 shrink-0 items-center justify-between border-b px-8"
      style={{ borderColor: '#ECE9F5', background: '#ffffff' }}
    >
      <h1 className="text-xl font-semibold tracking-tight" style={{ color: '#1A1240' }}>
        {titleFor(pathname)}
      </h1>

      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-[#F7F5FB]"
          style={{ borderColor: '#E4E0F0', color: '#1A1240' }}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="text-xs uppercase tracking-wider" style={{ color: '#7a72a8' }}>
            Role
          </span>
          <span>{role}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: '#7a72a8' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute right-0 z-10 mt-1.5 w-52 overflow-hidden rounded-md border bg-white shadow-lg"
            style={{ borderColor: '#E4E0F0' }}
          >
            {ROLES.map((r) => (
              <li key={r}>
                <button
                  type="button"
                  role="option"
                  aria-selected={role === r}
                  onClick={() => {
                    setRole(r)
                    setOpen(false)
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-[#F7F5FB]"
                  style={{ color: '#1A1240' }}
                >
                  <span>{r}</span>
                  {role === r && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6E5CFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  )
}
