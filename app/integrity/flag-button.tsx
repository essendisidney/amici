'use client'

import { flagIntegrityGap } from '@/app/actions'
import { useState } from 'react'

export function FlagButton({ gapId, enabled }: { gapId: string; enabled: boolean }) {
  const [done, setDone] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  if (!enabled) {
    return <span className="muted">Sign in after backend link</span>
  }

  return (
    <button
      className="btn ghost"
      type="button"
      disabled={done}
      onClick={async () => {
        const r = await flagIntegrityGap(gapId)
        if (r.error) setErr(r.error)
        else setDone(true)
      }}
    >
      {done ? 'Flagged' : err ?? 'Flag delay'}
    </button>
  )
}
