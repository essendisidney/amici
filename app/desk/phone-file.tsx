'use client'

import { loadFile } from '@/lib/file-store'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function PhoneFile() {
  const [file, setFile] = useState<ReturnType<typeof loadFile> | null>(null)

  useEffect(() => {
    setFile(loadFile())
  }, [])

  if (!file) return null

  return (
    <section className="panel" style={{ marginTop: 16 }}>
      <h2>On this phone</h2>
      {file.pings.length === 0 && file.matters.length === 0 && (
        <p className="muted">
          Watch a number or <Link href="/lawyers">open a thread</Link>. They stay here until a backend is linked.
        </p>
      )}
      {file.pings.slice(0, 3).map((p) => (
        <Link className="row" key={p.id} href="/inbox" style={{ textDecoration: 'none' }}>
          <div>
            <strong>{p.text}</strong>
            <div className="muted">Hearing ping</div>
          </div>
        </Link>
      ))}
      {file.matters.slice(0, 3).map((m) => (
        <Link className="row" key={m.id} href={`/inbox/${m.id}`} style={{ textDecoration: 'none' }}>
          <div>
            <strong>{m.advocate}</strong>
            <div className="muted">{m.matter}</div>
          </div>
          <span className="muted">{m.messages.length}</span>
        </Link>
      ))}
      {(file.pings.length > 0 || file.matters.length > 0) && (
        <p style={{ marginTop: 12 }}>
          <Link href="/inbox">Open inbox</Link>
        </p>
      )}
    </section>
  )
}
