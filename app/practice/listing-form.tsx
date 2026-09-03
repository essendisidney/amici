'use client'

import { createListing } from '@/app/actions'
import { useState } from 'react'

export function ListingForm() {
  const [msg, setMsg] = useState<string | null>(null)

  return (
    <form
      className="panel"
      action={async (fd) => {
        const r = await createListing(fd)
        setMsg(r.error ?? 'Listing saved as a draft. It stays unpublished until LSK verification.')
      }}
    >
      <h2>Your chambers card</h2>
      <p className="muted">Public directory only after verification. You cannot self-tick LSK or publish.</p>
      <div className="field">
        <label htmlFor="display_name">Name on the card</label>
        <input id="display_name" name="display_name" required />
      </div>
      <div className="field">
        <label htmlFor="firm">Firm</label>
        <input id="firm" name="firm" required />
      </div>
      <div className="field">
        <label htmlFor="town">Town</label>
        <input id="town" name="town" required placeholder="Kisumu" />
      </div>
      <div className="field">
        <label htmlFor="bio">How you work</label>
        <input id="bio" name="bio" required />
      </div>
      <div className="field">
        <label htmlFor="areas">Areas (comma)</label>
        <input id="areas" name="areas" placeholder="Land, Succession" />
      </div>
      <div className="field">
        <label htmlFor="fee_from">Fees from</label>
        <input id="fee_from" name="fee_from" defaultValue="KSh 3,000 consult" />
      </div>
      <button className="btn" type="submit">
        Save draft listing
      </button>
      {msg && <p className="notice">{msg}</p>}
    </form>
  )
}
