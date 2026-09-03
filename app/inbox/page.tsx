'use client'

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
      <p className="lede">Hearing pings when a watched number hits the cause list. Matters stay on this device until Supabase is linked.</p>
      <div className="dash">
        <section className="panel">
          <h2>Hearings</h2>
          {file.pings.length === 0 && <p className="muted">Watch a case that is on the list.</p>}
          {file.pings.map((p) => (
            <Link className="row" key={p.id} href={p.href} style={{ textDecoration: 'none' }}>
              <div>
                <strong>{p.text}</strong>
                <div className="muted">{p.at}</div>
              </div>
            </Link>
          ))}
        </section>
        <section className="panel">
          <h2>Matters</h2>
          {file.matters.length === 0 && (
            <p className="muted">
              <Link href="/lawyers">Ask a wakili</Link> to open a thread.
            </p>
          )}
          {file.matters.map((m) => (
            <Link className="row" key={m.id} href={`/inbox/${m.id}`} style={{ textDecoration: 'none' }}>
              <div>
                <strong>{m.advocate}</strong>
                <div className="muted">
                  {m.matter} · {m.status}
                </div>
              </div>
              <span className="muted">{m.messages.length}</span>
            </Link>
          ))}
        </section>
      </div>
    </>
  )
}
