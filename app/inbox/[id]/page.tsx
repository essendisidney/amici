'use client'

import { addLine, getMatter, type Matter } from '@/lib/file-store'
import { EvidenceSms } from '@/components/EvidenceSms'
import { useLang } from '@/components/Lang'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function MatterRoom() {
  const { t } = useLang()
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

  const isLockout =
    `${matter.matter} ${matter.opponent ?? ''}`.toLowerCase().includes('lock') ||
    `${matter.matter} ${matter.opponent ?? ''}`.toLowerCase().includes('landlord')

  const placeholder = isLockout ? t.lockHint : 'Send a fact, not a novel…'

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

  function addLockoutSnippet(snippet: string) {
    setText((prev) => {
      const next = prev.trim()
      return next ? `${next}\n${snippet}` : snippet
    })
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
        {isLockout ? (
          <Link className="btn ghost" href={`/proof?kind=evidence&matterId=${encodeURIComponent(id)}`}>
            {t.evidencePack}
          </Link>
        ) : null}
      </p>
      {isLockout ? (
        <section className="panel" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: 6 }}>{t.evidencePack}</h2>
          <p className="muted" style={{ marginBottom: 10 }}>
            {t.evidencePackLead}
          </p>
          <EvidenceSms matter={matter} />
        </section>
      ) : null}
      <div className="thread">
        {matter.messages.map((m, i) => (
          <div key={`${m.at}-${i}`} className={`bubble ${m.from === 'me' ? 'me' : ''}`}>
            <div className="meta">{m.from === 'me' ? 'You' : matter.advocate}</div>
            {m.text}
          </div>
        ))}
      </div>
      <div className="composer">
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {isLockout ? (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn ghost" type="button" onClick={() => addLockoutSnippet(t.lockDateLine)}>
                {t.lockDate}
              </button>
              <button className="btn ghost" type="button" onClick={() => addLockoutSnippet(t.lockReceiptLine)}>
                {t.lockReceipt}
              </button>
              <button className="btn ghost" type="button" onClick={() => addLockoutSnippet(t.lockPhotoLine)}>
                {t.lockPhoto}
              </button>
              <button className="btn ghost" type="button" onClick={() => addLockoutSnippet(t.lockThreatLine)}>
                {t.lockThreat}
              </button>
            </div>
          ) : null}
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} />
        </div>
        <button className="btn" type="button" onClick={send}>
          {t.send}
        </button>
      </div>
    </>
  )
}
