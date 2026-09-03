'use client'

import { getMatter, setMatterDetails } from '@/lib/file-store'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type Hold = {
  id: string
  status: string
  amountKes: number
  purpose: string
  label: string
  matterId: string | null
  msisdn: string
  mpesaReceipt: string | null
}

export default function BriefPage() {
  const { id } = useParams<{ id: string }>()
  const [matter, setMatter] = useState<ReturnType<typeof getMatter>>(null)
  const [holds, setHolds] = useState<Hold[]>([])
  const [clientName, setClientName] = useState('')
  const [town, setTown] = useState('')
  const [opponent, setOpponent] = useState('')
  const [receiptRef, setReceiptRef] = useState('')
  const [evidenceNote, setEvidenceNote] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    const item = getMatter(id)
    setMatter(item)
    setClientName(item?.clientName ?? '')
    setTown(item?.town ?? '')
    setOpponent(item?.opponent ?? '')
    setReceiptRef(item?.receiptRef ?? '')
    setEvidenceNote(item?.evidenceNote ?? '')
    async function load() {
      const res = await fetch('/api/mpesa/holds')
      if (!res.ok) return
      const rows = (await res.json()) as Hold[]
      setHolds(rows.filter((row) => row.matterId === id))
    }
    load()
  }, [id])

  if (!matter) {
    return (
      <p className="lede">
        No local brief for that matter. <Link href="/practice">Practice</Link>
      </p>
    )
  }

  const latest = matter.messages.at(-1)
  const held = holds.find((h) => h.status === 'held' || h.status === 'released') ?? holds[0]
  const baseFacts = matter.messages[0]?.text ?? matter.matter
  const extra: string[] = []
  if (evidenceNote.trim()) extra.push(`Evidence note: ${evidenceNote.trim()}`)
  if (receiptRef.trim()) extra.push(`Receipt ref: ${receiptRef.trim()}`)
  const factsForDraft = extra.length ? `${baseFacts}\n\n${extra.join('\n')}` : baseFacts

  const draftHref = `/practice/draft?client=${encodeURIComponent(clientName || 'Client to confirm')}&opponent=${encodeURIComponent(
    opponent || 'Other party to confirm',
  )}&town=${encodeURIComponent(town || 'Town to confirm')}&amount=${encodeURIComponent(
    held ? `KSh ${held.amountKes}` : '',
  )}&facts=${encodeURIComponent(factsForDraft)}`

  function saveDetails() {
    const next = setMatterDetails(id, { clientName, town, opponent, receiptRef, evidenceNote })
    if (!next) return
    setMatter(next)
    setMsg('Saved to this phone.')
  }

  return (
    <>
      <Link className="crumb" href="/practice">
        Practice
      </Link>
      <p className="kicker">Chambers brief</p>
      <h1 style={{ fontSize: 'clamp(2.4rem, 7vw, 4rem)', marginBottom: 12 }}>{matter.matter}</h1>
      <p className="lede">
        {matter.advocate} · {matter.status}
      </p>
      <div className="dash">
        <section className="panel">
          <h2>Facts so far</h2>
          <p>{matter.messages[0]?.text}</p>
          <div className="field">
            <label htmlFor="clientName">Client</label>
            <input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Client to confirm"
            />
          </div>
          <div className="field">
            <label htmlFor="town">Town</label>
            <input id="town" value={town} onChange={(e) => setTown(e.target.value)} placeholder="Town to confirm" />
          </div>
          <div className="field">
            <label htmlFor="opponent">Other party</label>
            <input
              id="opponent"
              value={opponent}
              onChange={(e) => setOpponent(e.target.value)}
              placeholder="Other party to confirm"
            />
          </div>
          <div className="field">
            <label htmlFor="receiptRef">Receipt ref</label>
            <input
              id="receiptRef"
              value={receiptRef}
              onChange={(e) => setReceiptRef(e.target.value)}
              placeholder="Receipt or voucher ref"
            />
          </div>
          <div className="field">
            <label htmlFor="evidenceNote">Evidence note</label>
            <textarea
              id="evidenceNote"
              value={evidenceNote}
              onChange={(e) => setEvidenceNote(e.target.value)}
              placeholder="What papers, photos, or receipts still need checking?"
            />
          </div>
          <p>
            <button className="btn ghost" type="button" onClick={saveDetails}>
              Save labels
            </button>
          </p>
          {msg ? <p className="muted">{msg}</p> : null}
          <p className="muted">Messages in thread: {matter.messages.length}</p>
          {latest ? <p className="muted">Latest: {latest.text}</p> : null}
        </section>
        <section className="panel">
          <h2>Money status</h2>
          {matter.receiptRef ? <p className="muted">Brief ref: {matter.receiptRef}</p> : null}
          {matter.evidenceNote ? <p className="muted">{matter.evidenceNote}</p> : null}
          {holds.length === 0 && <p className="muted">No consult hold linked to this matter yet.</p>}
          {holds.map((h) => (
            <div className="row" key={h.id}>
              <div>
                <strong>
                  KSh {h.amountKes} · {h.status}
                </strong>
                <div className="muted">{h.mpesaReceipt ?? 'Awaiting receipt'} · {h.msisdn}</div>
              </div>
            </div>
          ))}
        </section>
      </div>
      <p style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Link className="btn" href={`/inbox/${id}`}>
          Open thread
        </Link>
        <Link className="btn ghost" href="/pay/holds">
          Open holds
        </Link>
        <Link className="btn ghost" href={draftHref}>
          Draft letter
        </Link>
      </p>
      <p className="muted">Human signs next. This is a chambers handoff, not a court filing.</p>
    </>
  )
}
