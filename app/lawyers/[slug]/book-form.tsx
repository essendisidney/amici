'use client'

import { holdEscrow, requestConsult } from '@/app/actions'
import { useState } from 'react'

export function BookForm({ advocateId, demo }: { advocateId: string; demo: boolean }) {
  const [msg, setMsg] = useState<string | null>(null)

  return (
    <div className="ussd">
      <strong>M-PESA held until the milestone is done</strong>
      <p>
        Paybill 400200 · Account AMICI-DEP · <a href="/pay?purpose=consult">Send STK</a> ·{' '}
        <a href="/proof">SMS proof</a>
      </p>
      {demo ? (
        <p className="muted">Sign-in and escrow write to Supabase once env vars are set.</p>
      ) : (
        <>
          <form
            action={async (fd) => {
              const r = await requestConsult(fd)
              setMsg(r.error ?? 'Request sent to the advocate.')
            }}
          >
            <input type="hidden" name="advocate_id" value={advocateId} />
            <div className="field">
              <label htmlFor="matter">What happened</label>
              <input id="matter" name="matter" required placeholder="Landlord locked me out, Kahawa West" />
            </div>
            <button className="btn" type="submit">
              Request a consult
            </button>
          </form>
          <form
            style={{ marginTop: 12 }}
            action={async (fd) => {
              const r = await holdEscrow(fd)
              setMsg(r.error ?? 'Deposit marked held. Wire Daraja before you take live money.')
            }}
          >
            <input type="hidden" name="advocate_id" value={advocateId} />
            <input type="hidden" name="amount_kes" value="1500" />
            <button className="btn ghost" type="submit">
              Hold KSh 1,500
            </button>
          </form>
        </>
      )}
      {msg && <p className="notice">{msg}</p>}
    </div>
  )
}
