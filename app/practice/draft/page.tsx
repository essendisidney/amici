'use client'

import { queueDraft } from '@/app/actions'
import { draftDemandLetter } from '@/lib/draft'
import { hasEnvVars } from '@/lib/utils'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export default function DraftPage() {
  const [client, setClient] = useState('Grace Muthoni')
  const [opponent, setOpponent] = useState('Kahawa West Properties')
  const [town, setTown] = useState('Nairobi')
  const [amount, setAmount] = useState('KSh 48,000')
  const [facts, setFacts] = useState('The landlord changed the locks on 28 August 2026 after rent was paid for August.')
  const [msg, setMsg] = useState<string | null>(null)

  const preview = useMemo(
    () => draftDemandLetter({ client, opponent, town, facts, amount }),
    [amount, client, facts, opponent, town],
  )

  return (
    <>
      <Link className="crumb" href="/practice">
        Practice
      </Link>
      <p className="kicker">Human in the loop</p>
      <h1 style={{ fontSize: 'clamp(2.4rem, 7vw, 4rem)', marginBottom: 12 }}>Draft</h1>
      <p className="lede">
        A Kenyan demand skeleton. No invented statutes. You sign, or it does not leave the firm.
      </p>
      <div className="dash">
        <form
          className="panel"
          action={async (fd) => {
            if (!hasEnvVars) {
              setMsg('Preview only until Supabase is linked. Then this lands in Human review.')
              return
            }
            const r = await queueDraft(fd)
            if (r?.error) setMsg(r.error)
          }}
        >
          <div className="field">
            <label htmlFor="client">Client</label>
            <input id="client" name="client" value={client} onChange={(e) => setClient(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="opponent">Other party</label>
            <input id="opponent" name="opponent" value={opponent} onChange={(e) => setOpponent(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="town">Town</label>
            <input id="town" name="town" value={town} onChange={(e) => setTown(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="amount">Sum (optional)</label>
            <input id="amount" name="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="facts">Facts in their words</label>
            <textarea id="facts" name="facts" value={facts} onChange={(e) => setFacts(e.target.value)} />
          </div>
          <button className="btn" type="submit">
            Send to review queue
          </button>
          {msg && <p className="notice">{msg}</p>}
        </form>
        <section className="panel">
          <h2>{preview.docType}</h2>
          <p className="alert">{preview.risk}</p>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--mono)', fontSize: '0.82rem' }}>{preview.body}</pre>
        </section>
      </div>
    </>
  )
}
