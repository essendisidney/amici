'use client'

import { useState, Suspense, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { caseCache } from '@/lib/cases'
import { hearingFor } from '@/lib/cause-list'
import { useLang } from '@/components/Lang'
import { HearingSms } from '@/components/HearingSms'
import { WatchForm } from './watch-form'

function TrackBody() {
  const { t } = useLang()
  const search = useSearchParams()
  const [num, setNum] = useState('HCCC/1234/2023')
  const [found, setFound] = useState<(typeof caseCache)[string] | null>(caseCache['HCCC/1234/2023'])
  const hearing = found ? hearingFor(found.number) : null

  useEffect(() => {
    const n = search.get('n')
    if (!n) return
    const key = n.trim().toUpperCase()
    setNum(n.trim())
    setFound(caseCache[key] ?? null)
  }, [search])

  return (
    <>
      <Link className="crumb" href="/citizen">
        {t.back}
      </Link>
      <p className="kicker">Not CTS</p>
      <h1 style={{ fontSize: 'clamp(2.4rem, 7vw, 4rem)', marginBottom: 10 }}>{t.trackCase}</h1>
      <p className="lede">
        {t.trackTry}{' '}
        <Link href="/cause-list">{t.openCauseList}</Link>
      </p>
      <div className="composer">
        <input
          aria-label={t.caseNumber}
          value={num}
          onChange={(e) => setNum(e.target.value)}
          style={{ flex: 1 }}
        />
        <button className="btn" type="button" onClick={() => setFound(caseCache[num.trim().toUpperCase()] ?? null)}>
          {t.track}
        </button>
        <a className="btn ghost" href="https://judiciary.ecitizen.go.ke" target="_blank" rel="noreferrer">
          {t.officialCts}
        </a>
      </div>
      {found ? (
        <article className="panel" style={{ marginTop: 18 }}>
          <h3>{found.title}</h3>
          <p className="muted">
            {found.number} · {found.court}
          </p>
          <p>{found.status}</p>
          <p>
            <strong>{found.next}</strong>
          </p>
          {hearing ? (
            <p className="trust">
              {t.onCauseList}: {hearing.date} {hearing.time}, room {hearing.room}. {t.confirmOfficial}{' '}
              <Link href="/cause-list">{t.causeListLink}</Link>
              {' · '}
              <Link href="/inbox">{t.inbox}</Link>
            </p>
          ) : null}
          <p className="alert" style={{ background: 'rgba(214, 255, 61, 0.08)', borderColor: 'rgba(214, 255, 61, 0.35)' }}>
            {t.trackNext}
          </p>
          <ol className="timeline">
            {found.steps.map((s) => (
              <li key={s.label}>
                <span className={`dot ${s.done ? 'on' : ''}`} />
                <span>{s.label}</span>
                <span className="muted">{s.date}</span>
              </li>
            ))}
          </ol>
          <WatchForm
            caseNumber={found.number}
            title={found.title}
            court={found.court}
            statusNote={found.status}
          />
          {hearing ? (
            <div style={{ marginTop: 16 }}>
              <h3 style={{ fontSize: '1.1rem' }}>{t.hearingSms}</h3>
              <p className="muted">{t.hearingSmsLead}</p>
              <HearingSms number={found.number} />
            </div>
          ) : null}
        </article>
      ) : (
        <p className="notice">{t.trackNotFound}</p>
      )}
    </>
  )
}

export default function Track() {
  return (
    <Suspense fallback={null}>
      <TrackBody />
    </Suspense>
  )
}
