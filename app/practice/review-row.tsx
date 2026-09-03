'use client'

import { resolveReview } from '@/app/actions'

export function ReviewRow({
  id,
  docType,
  client,
  risk,
  body,
}: {
  id: string
  docType: string
  client: string
  risk: string
  body?: string | null
}) {
  return (
    <div className="row" style={{ alignItems: 'flex-start' }}>
      <div>
        <strong>{docType}</strong>
        <div className="muted">{client}</div>
        <div>{risk}</div>
        {body && (
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--mono)', fontSize: '0.75rem', marginTop: 8 }}>
            {body}
          </pre>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <form action={resolveReview}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value="approved" />
          <button className="btn" type="submit">
            Sign
          </button>
        </form>
        <form action={resolveReview}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value="rejected" />
          <button className="btn ghost" type="submit">
            Redo
          </button>
        </form>
      </div>
    </div>
  )
}
