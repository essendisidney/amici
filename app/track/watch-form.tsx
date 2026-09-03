'use client'

import { watchCase } from '@/app/actions'
import { addWatch } from '@/lib/file-store'
import { hasEnvVars } from '@/lib/utils'
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
        addWatch({ number: caseNumber, title, court })
        if (!hasEnvVars) {
          setMsg('Watched. If it is on the cause list, Inbox gets a ping.')
          return
        }
        const r = await watchCase(fd)
        setMsg(r?.error ?? 'Watched. If it is on the cause list, Inbox gets a ping.')
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
