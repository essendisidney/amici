'use client'

import { useState } from 'react'
import Link from 'next/link'
import { caseCache } from '@/lib/cases'
import { useLang } from '@/components/Lang'
import { WatchForm } from './watch-form'

export default function Track() {
  const { t } = useLang()
  const [num, setNum] = useState('HCCC/1234/2023')
  const [found, setFound] = useState<(typeof caseCache)[string] | null>(caseCache['HCCC/1234/2023'])

  return (
    <>
      <Link className="crumb" href="/citizen">
        {t.back}
      </Link>
      <p className="kicker">Not CTS</p>
      <h1 style={{ fontSize: 'clamp(2.4rem, 7vw, 4rem)', marginBottom: 10 }}>{t.trackCase}</h1>
      <p className="lede">
        Try HCCC/1234/2023 or SCCC/441/2026. Live status still belongs to the Judiciary.{' '}
        <Link href="/cause-list">Open the cause list</Link>
      </p>
      <div className="composer">
        <input
          aria-label={t.caseNumber}
          value={num}
          onChange={(e) => setNum(e.target.value)}
          style={{ flex: 1, border: '1px solid var(--line)', background: 'var(--sheet)', padding: '10px 12px' }}
        />
        <button className="btn" type="button" onClick={() => setFound(caseCache[num.trim().toUpperCase()] ?? null)}>
          {t.track}
        </button>
        <a className="btn ghost" href="https://judiciary.ecitizen.go.ke" target="_blank" rel="noreferrer">
          {t.officialCts}
        </a>
      </div>
      {found ? (
        <article className="card" style={{ marginTop: 18 }}>
          <h3>{found.title}</h3>
          <p className="muted">
            {found.number} · {found.court}
          </p>
          <p>{found.status}</p>
          <p>
            <strong>{found.next}</strong>
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
        </article>
      ) : (
        <p className="notice">No Amici cache for that number. Use official CTS.</p>
      )}
    </>
  )
}
