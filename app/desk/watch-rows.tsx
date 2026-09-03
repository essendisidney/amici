'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { HearingSms } from '@/components/HearingSms'
import { hearingFor } from '@/lib/cause-list'
import { loadFile, type Watch } from '@/lib/file-store'
import { useLang } from '@/components/Lang'
import { hasEnvVars } from '@/lib/utils'

export function WatchRows({ serverWatches }: { serverWatches: Watch[] }) {
  const { t } = useLang()
  const [watches, setWatches] = useState<Watch[]>(serverWatches)

  useEffect(() => {
    if (!hasEnvVars) setWatches(loadFile().watches)
  }, [])

  if (watches.length === 0) {
    return (
      <p className="muted">
        {t.nothingWatched} <Link href="/track">{t.trackCase}</Link>
      </p>
    )
  }

  return (
    <>
      {watches.map((w) => {
        const hearing = hearingFor(w.number)
        return (
          <div className="row" key={w.number}>
            <div>
              <strong>
                <Link href={`/track?n=${encodeURIComponent(w.number)}`}>{w.number}</Link>
              </strong>
              <div className="muted">{w.title}</div>
              {hearing ? (
                <div className="trust" style={{ marginTop: 6, fontSize: '0.88rem' }}>
                  {t.nextHearing}: {hearing.date} {hearing.time}, room {hearing.room}.{' '}
                  <Link href="/inbox">{t.inbox}</Link>
                  <HearingSms number={w.number} compact />
                </div>
              ) : (
                <div className="muted" style={{ marginTop: 6, fontSize: '0.88rem' }}>
                  {t.noHearing}
                </div>
              )}
            </div>
            <Link href={`/track?n=${encodeURIComponent(w.number)}`}>{w.court}</Link>
          </div>
        )
      })}
    </>
  )
}
