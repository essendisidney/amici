'use client'

import { completeOnboarding } from '@/app/actions'
import { useState } from 'react'

export function AccountForm({
  email,
  fullName,
  phone,
  lang,
  role,
}: {
  email: string
  fullName: string
  phone: string
  lang: string
  role: string
}) {
  const [error, setError] = useState<string | null>(null)

  return (
    <form
      action={async (fd) => {
        const r = await completeOnboarding(fd)
        if (r?.error) setError(r.error)
      }}
    >
      <p className="muted">{email}</p>
      <div className="field">
        <label htmlFor="full_name">Name</label>
        <input id="full_name" name="full_name" defaultValue={fullName} required />
      </div>
      <div className="field">
        <label htmlFor="phone">Phone (M-PESA)</label>
        <input id="phone" name="phone" defaultValue={phone} placeholder="07…" />
      </div>
      <div className="field">
        <label htmlFor="lang">Language</label>
        <select id="lang" name="lang" defaultValue={lang}>
          <option value="en">English</option>
          <option value="sw">Kiswahili</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="role">I am here as</label>
        <select id="role" name="role" defaultValue={role}>
          <option value="citizen">A person who needs help</option>
          <option value="advocate">An advocate</option>
        </select>
      </div>
      <button className="btn" type="submit">
        Save
      </button>
      {error && <p className="notice">{error}</p>}
    </form>
  )
}
