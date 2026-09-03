'use client'

import { HearingSms } from '@/components/HearingSms'
import { loadFile } from '@/lib/file-store'
import Link from 'next/link'
import { useEffect, useState } from 'react'
export default function Inbox() {
  const [file, setFile] = useState<ReturnType<typeof loadFile> | null>(null)

  useEffect(() => {
    setFile(loadFile())
  }, [])

  if (!file) return null

  return (
    <>
      <Link className="crumb" href="/desk">
        Desk
      </Link>
      <p className="kicker">SMS on this phone</p>
      <h1 style={{ fontSize: 'clamp(2.6rem, 8vw, 4.6rem)', marginBottom: 12 }}>Inbox</h1>
      <p className="lede">
        Hearing pings when a watched number hits the cause list. Copy the SMS before you travel. Matters stay on this
        device until Supabase is linked.
      </p>
      <div className="dash">
        <section className="panel">
          <h2>Hearings</h2>
          {file.pings.length === 0 && <p className="muted">Watch a case that is on the list.</p>}
          {file.pings.map((p) => {
            const number = p.id.replace(/^hear-/, '')
            return (
              <div className="row" key={p.id} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
                <Link href={p.href} style={{ textDecoration: 'none' }}>
                  <strong>{p.text}</strong>
                  <div className="muted">{p.at}</div>
                </Link>
                <HearingSms number={number} compact />
              </div>
            )
          })}
        </section>
        <section className="panel">
          <h2>Matters</h2>
          {file.matters.length === 0 && (
            <p className="muted">
              <Link href="/lawyers">Ask a wakili</Link> to open a thread.
            </p>
          )}
          {file.matters.map((m) => {
            const lockout =
              `${m.matter} ${m.opponent ?? ''}`.toLowerCase().includes('lock') ||
              `${m.matter} ${m.opponent ?? ''}`.toLowerCase().includes('landlord')
            return (
              <div key={m.id} className="row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
                <Link href={`/inbox/${m.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <strong>{m.advocate}</strong>
                      <div className="muted">
                        {m.matter} · {m.status}
                      </div>
                    </div>
                    <span className="muted">{m.messages.length}</span>
                  </div>
                </Link>
                {lockout ? (
                  <Link className="btn ghost" href={`/proof?kind=evidence&matterId=${encodeURIComponent(m.id)}`}>
                    Evidence pack
                  </Link>
                ) : null}
              </div>
            )
          })}
        </section>
      </div>
    </>
  )
}
