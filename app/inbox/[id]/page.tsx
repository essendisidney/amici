'use client'

import { addLine, getMatter, type Matter } from '@/lib/file-store'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function MatterRoom() {
  const { id } = useParams<{ id: string }>()
  const [matter, setMatter] = useState<Matter | null | undefined>(undefined)
  const [text, setText] = useState('')

  useEffect(() => {
    setMatter(getMatter(id))
  }, [id])

  if (matter === undefined) return null

  if (!matter) {
    return (
      <p className="lede">
        No thread on this phone. <Link href="/inbox">Inbox</Link>
      </p>
    )
  }

  function send() {
    const q = text.trim()
    if (!q) return
    const next = addLine(id, 'me', q)
    if (next) {
      window.setTimeout(() => {
        setMatter(addLine(id, 'them', 'Noted. I will not file anything until I have seen the papers.'))
      }, 600)
    }
    setMatter(next)
    setText('')
  }

  return (
    <>
      <Link className="crumb" href="/inbox">
        Inbox
      </Link>
      <p className="kicker">{matter.advocate}</p>
      <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.4rem)', marginBottom: 8 }}>{matter.matter}</h1>
      <p className="muted">Status: {matter.status} · Not a court filing. The advocate still signs.</p>
      {matter.town || matter.opponent ? (
        <p className="muted">
          {matter.town ?? 'Town to confirm'} · {matter.opponent ?? 'Other party to confirm'}
        </p>
      ) : null}
      <p style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Link
          className="btn"
          href={`/pay?purpose=consult&amount=1500&label=${encodeURIComponent(`${matter.advocate} consult`)}&matterId=${encodeURIComponent(id)}`}
        >
          Hold KSh 1,500
        </Link>
        <Link
          className="btn ghost"
          href={`/proof?kind=consult&advocate=${encodeURIComponent(matter.advocate)}&amount=1500`}
        >
          Draft SMS proof
        </Link>
      </p>
      <div className="thread">
        {matter.messages.map((m, i) => (
          <div key={`${m.at}-${i}`} className={`bubble ${m.from === 'me' ? 'me' : ''}`}>
            <div className="meta">{m.from === 'me' ? 'You' : matter.advocate}</div>
            {m.text}
          </div>
        ))}
      </div>
      <div className="composer">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Send a fact, not a novel…" />
        <button className="btn" type="button" onClick={send}>
          Send
        </button>
      </div>
    </>
  )
}
