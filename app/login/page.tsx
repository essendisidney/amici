'use client'

import { signInWithEmail } from '@/app/actions'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

function Form() {
  const next = useSearchParams().get('next') ?? '/practice'
  const [state, setState] = useState<string | null>(null)

  return (
    <form
      action={async (fd) => {
        const r = await signInWithEmail(fd)
        setState(r.error ?? 'Check your email for the magic link.')
      }}
    >
      <input type="hidden" name="next" value={next} />
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <button className="btn" type="submit">
        Send magic link
      </button>
      {state && <p className="notice">{state}</p>}
    </form>
  )
}

export default function Login() {
  return (
    <>
      <h1>Sign in</h1>
      <p className="lede">
        Magic link only. Your role is stored on the <code>profiles</code> table so it cannot be forged from the
        browser JWT.
      </p>
      <Suspense>
        <Form />
      </Suspense>
    </>
  )
}
