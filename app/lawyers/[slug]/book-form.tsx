'use client'

import { holdEscrow, requestConsult } from '@/app/actions'
import { openMatter } from '@/lib/file-store'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function BookForm({
  advocateId,
  advocateName,
  demo,
}: {
  advocateId: string
  advocateName: string
  demo: boolean
}) {
  const router = useRouter()
  const [msg, setMsg] = useState<string | null>(null)
  const [matter, setMatter] = useState('')

  function startThread(text: string) {
    const room = openMatter(advocateName, text)
    router.push(`/inbox/${room.id}`)
  }

  return (
    <div className="ussd">
      <strong>M-PESA held until the milestone is done</strong>
      <p>
        Paybill 400200 · Account AMICI-DEP · <a href="/pay?purpose=consult">Send STK</a> ·{' '}
        <a href="/proof">SMS proof</a>
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const text = matter.trim()
          if (!text) return
          if (!demo) {
            const fd = new FormData()
            fd.set('advocate_id', advocateId)
            fd.set('matter', text)
            const r = await requestConsult(fd)
            if (r.error) {
              setMsg(r.error)
              return
            }
          }
          startThread(text)
        }}
      >
        <div className="field">
          <label htmlFor="matter">What happened</label>
          <input
            id="matter"
            name="matter"
            required
            value={matter}
            onChange={(e) => setMatter(e.target.value)}
            placeholder="Landlord locked me out, Kahawa West"
          />
        </div>
        <button className="btn" type="submit">
          Open a thread
        </button>
      </form>
      {!demo && (
        <form
          style={{ marginTop: 12 }}
          action={async (fd) => {
            const r = await holdEscrow(fd)
            setMsg(r.error ?? 'Deposit marked held.')
          }}
        >
          <input type="hidden" name="advocate_id" value={advocateId} />
          <input type="hidden" name="amount_kes" value="1500" />
          <button className="btn ghost" type="submit">
            Hold KSh 1,500
          </button>
        </form>
      )}
      {msg && <p className="notice">{msg}</p>}
    </div>
  )
}
