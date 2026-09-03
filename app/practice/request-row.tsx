'use client'

import { setConsultStatus } from '@/app/actions'

export function RequestRow({
  id,
  matter,
  budget,
  status,
}: {
  id: string
  matter: string
  budget: string | null
  status: string
}) {
  return (
    <div className="row">
      <div>
        <strong>{matter}</strong>
        <div className="muted">{status}</div>
      </div>
      <div>
        <span className="muted">{budget}</span>
        {status === 'pending' && (
          <form action={setConsultStatus}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="status" value="accepted" />
            <button className="btn" type="submit">
              Accept
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
