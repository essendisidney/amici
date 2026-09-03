'use client'

import { watchCase } from '@/app/actions'
import { useLang } from '@/components/Lang'
import { addWatch } from '@/lib/file-store'
import { hasEnvVars } from '@/lib/utils'
import Link from 'next/link'
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
  const { t } = useLang()
  const [msg, setMsg] = useState<string | null>(null)

  return (
    <form
      action={async (fd) => {
        addWatch({ number: caseNumber, title, court })
        if (!hasEnvVars) {
          setMsg(t.watchOk)
          return
        }
        const r = await watchCase(fd)
        setMsg(r?.error ?? t.watchOk)
      }}
    >
      <input type="hidden" name="case_number" value={caseNumber} />
      <input type="hidden" name="title" value={title} />
      <input type="hidden" name="court" value={court} />
      <input type="hidden" name="status_note" value={statusNote} />
      <button className="btn" type="submit">
        {t.watchNumber}
      </button>
      {msg && (
        <p className="muted">
          {msg}{' '}
          <Link href="/inbox">{t.openInbox}</Link>
          {' · '}
          <Link href={`/proof?kind=hearing&n=${encodeURIComponent(caseNumber)}`}>{t.hearingSms}</Link>
        </p>
      )}
    </form>
  )
}
