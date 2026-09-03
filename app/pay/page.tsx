'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import Link from 'next/link'

function Form() {
  const router = useRouter()
  const q = useSearchParams()
  const [phone, setPhone] = useState('0712345678')
  const [amount, setAmount] = useState(q.get('amount') ?? '1500')
  const [purpose, setPurpose] = useState(q.get('purpose') === 'bail' ? 'bail' : 'consult')
  const [label, setLabel] = useState(q.get('label') ?? 'Wambui Njoroge consult')
  const matterId = q.get('matterId') ?? ''
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function push() {
    setBusy(true)
    setError(null)
    const res = await fetch('/api/mpesa/stk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, amountKes: Number(amount), purpose, label, matterId }),
    })
    const json = (await res.json()) as { id?: string; error?: string }
    setBusy(false)
    if (!res.ok || !json.id) {
      setError(json.error ?? 'Push failed')
      return
    }
    const next = matterId ? `/pay/${json.id}?matterId=${encodeURIComponent(matterId)}` : `/pay/${json.id}`
    router.push(next)
  }

  return (
    <>
      <Link className="crumb" href="/proof">
        Proof
      </Link>
      <p className="kicker">M-PESA · hold, not a court fee</p>
      <h1 style={{ fontSize: 'clamp(2.6rem, 8vw, 4.6rem)', marginBottom: 12 }}>Lipa</h1>
      <p className="lede">
        STK hits the handset. Until Daraja keys are in the server env, you confirm the PIN on this screen. Live keys
        never go in the browser.
      </p>
      <div className="panel" style={{ maxWidth: 420 }}>
        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
        </div>
        <div className="field">
          <label htmlFor="amount">KSh</label>
          <input id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" />
        </div>
        <div className="field">
          <label htmlFor="purpose">Purpose</label>
          <select id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
            <option value="consult">Advocate hold</option>
            <option value="bail">Cash bail proof</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="label">For</label>
          <input id="label" value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <button className="btn" type="button" disabled={busy} onClick={push}>
          {busy ? 'Pushing…' : 'Send STK'}
        </button>
        {error && <p className="notice">{error}</p>}
      </div>
    </>
  )
}

export default function Pay() {
  return (
    <Suspense>
      <Form />
    </Suspense>
  )
}
