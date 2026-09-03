'use client'

import { ussdStep } from '@/lib/ussd'
import { useState } from 'react'

export function UssdPhone() {
  const start = ussdStep([], '*483*54#')
  const [session, setSession] = useState<string[]>(start.session)
  const [screen, setScreen] = useState(start.screen)
  const [dial, setDial] = useState('')

  function send(value: string) {
    const next = ussdStep(session, value)
    setSession(next.session)
    setScreen(next.screen)
    setDial('')
  }

  return (
    <div className="phone">
      <div className="phone-ear" />
      <div className={`phone-lcd ${screen.type === 'END' ? 'end' : ''}`}>
        <div className="phone-net">Safaricom · AMICI</div>
        <pre>{screen.text}</pre>
        <div className="phone-meta">{screen.type === 'CON' ? 'Reply' : 'End of session'}</div>
      </div>
      <form
        className="phone-bar"
        onSubmit={(e) => {
          e.preventDefault()
          send(dial || '0')
        }}
      >
        <input
          value={dial}
          onChange={(e) => setDial(e.target.value)}
          inputMode="numeric"
          aria-label="USSD reply"
          placeholder="1"
        />
        <button className="btn" type="submit">
          Send
        </button>
      </form>
      <div className="phone-pad">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
          <button key={k} type="button" onClick={() => setDial((d) => d + k)}>
            {k}
          </button>
        ))}
      </div>
      <button className="btn ghost" type="button" onClick={() => send('*483*54#')}>
        Redial *483*54#
      </button>
    </div>
  )
}
