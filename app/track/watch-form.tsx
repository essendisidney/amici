'use client'

import { watchCase } from '@/app/actions'
import { useState } from 'react'

export function WatchForm({
  caseNumber,
  title,
  court,
  statusNote,
}: {
  caseNumber: string
  title: string
  court: string
  statusNote: string
}) {
  const [msg, setMsg] = useState<string | null>(null)

  return (
    <form
      action={async (fd) => {
        const r = await watchCase(fd)
        setMsg(r?.error ?? 'Saved to your watches. This is not CTS.')
      }}
    >
      <input type="hidden" name="case_number" value={caseNumber} />
      <input type="hidden" name="title" value={title} />
      <input type="hidden" name="court" value={court} />
      <input type="hidden" name="status_note" value={statusNote} />
      <button className="btn ghost" type="submit">
        Watch this number
      </button>
      {msg && <p className="muted">{msg}</p>}
    </form>
  )
}
