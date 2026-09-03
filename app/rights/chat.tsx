'use client'

import { persistRightsTurn } from '@/app/actions'
import { useLang } from '@/components/Lang'
import { rightsReply, type ChatMsg } from '@/lib/rights'
import Link from 'next/link'
import { useState } from 'react'

export function RightsChat({ signedIn, initial }: { signedIn: boolean; initial: ChatMsg[] }) {
  const { t, lang } = useLang()
  const [text, setText] = useState('')
  const [msgs, setMsgs] = useState<ChatMsg[]>(initial)

  async function send() {
    const q = text.trim()
    if (!q) return
    const answers = rightsReply(q, lang === 'sw')
    setMsgs((m) => [...m, { from: 'me', text: q }, ...answers])
    setText('')
    if (signedIn) {
      await persistRightsTurn(q, answers.map((a) => a.text).join('\n'))
    }
  }

  return (
    <div className="chat">
      <div>
        <Link className="crumb" href="/citizen">
          {t.back}
        </Link>
        <p className="kicker">Not legal advice</p>
        <h1 style={{ fontSize: 'clamp(2.4rem, 7vw, 4rem)', marginBottom: 10 }}>{t.knowRights}</h1>
        <p className="muted">{t.notAdvice}</p>
        {signedIn ? (
          <p className="trust">This thread is saved to your account.</p>
        ) : (
          <p className="muted">
            <Link href="/login?next=/rights">Sign in</Link> if you want this kept.
          </p>
        )}
      </div>
      <div className="thread">
        {msgs.map((m, i) => (
          <div key={i} className={`bubble ${m.from === 'me' ? 'me' : ''}`}>
            <div className="meta">{m.from === 'me' ? 'You' : 'Amici'}</div>
            {m.text}
          </div>
        ))}
        <div className="ussd">
          <strong>{t.nextSteps}</strong>
          <p>
            <Link href="/lawyers">{t.findLawyer}</Link> · <Link href="/track">{t.trackCase}</Link>
          </p>
        </div>
      </div>
      <div className="composer">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={t.chatPlaceholder} />
        <button className="btn" type="button" onClick={send}>
          {t.send}
        </button>
      </div>
    </div>
  )
}
