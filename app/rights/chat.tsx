'use client'

import { persistRightsTurn } from '@/app/actions'
import { useLang } from '@/components/Lang'
import { openMatter } from '@/lib/file-store'
import {
  clearRightsDraft,
  rightsReply,
  rightsTopic,
  saveRightsDraft,
  type ChatMsg,
  type RightsTopic,
} from '@/lib/rights'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function RightsChat({ signedIn, initial }: { signedIn: boolean; initial: ChatMsg[] }) {
  const { t, lang } = useLang()
  const router = useRouter()
  const [text, setText] = useState('')
  const [msgs, setMsgs] = useState<ChatMsg[]>(initial)
  const [topic, setTopic] = useState<RightsTopic | null>(null)
  const [lastAsk, setLastAsk] = useState('')

  async function sendText(q: string) {
    const ask = q.trim()
    if (!ask) return
    const answers = rightsReply(ask, lang === 'sw')
    const kind = rightsTopic(ask)
    setMsgs((m) => [...m, { from: 'me', text: ask }, ...answers])
    setTopic(kind)
    setLastAsk(ask)
    saveRightsDraft(ask)
    setText('')
    if (signedIn) {
      await persistRightsTurn(ask, answers.map((a) => a.text).join('\n'))
    }
  }

  function openWambui() {
    const matter = lastAsk || t.rightsLockChip
    saveRightsDraft(matter)
    const room = openMatter('Wambui Njoroge', matter)
    clearRightsDraft()
    router.push(`/inbox/${room.id}`)
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
        {topic === 'lockout' ? (
          <div className="panel" style={{ marginTop: 8 }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: 6 }}>{t.rightsHandoff}</h2>
            <p className="muted" style={{ marginBottom: 10 }}>
              {t.rightsEvidenceNext}
            </p>
            <div className="composer" style={{ flexWrap: 'wrap' }}>
              <button className="btn" type="button" onClick={openWambui}>
                {t.rightsOpenThread}
              </button>
              <Link className="btn ghost" href={`/lawyers/wambui?matter=${encodeURIComponent(lastAsk || t.rightsLockChip)}`}>
                {t.findLawyer}
              </Link>
              <Link className="btn ghost" href="/ussd">
                USSD
              </Link>
            </div>
          </div>
        ) : null}
        {topic === 'bail' ? (
          <div className="ussd">
            <strong>{t.nextSteps}</strong>
            <p>
              <Link href="/proof?kind=bail">{t.copySms}</Link> · <Link href="/track">{t.trackCase}</Link> ·{' '}
              <Link href="/lawyers/hassan">{t.findLawyer}</Link>
            </p>
          </div>
        ) : null}
        {topic !== 'lockout' && topic !== 'bail' ? (
          <div className="ussd">
            <strong>{t.nextSteps}</strong>
            <p>
              <Link href="/lawyers">{t.findLawyer}</Link> · <Link href="/track">{t.trackCase}</Link>
            </p>
          </div>
        ) : null}
      </div>
      <div className="composer" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn ghost" type="button" onClick={() => sendText(t.rightsLockChip)}>
            {t.rightsLockChip}
          </button>
          <button className="btn ghost" type="button" onClick={() => sendText(t.rightsBailChip)}>
            {t.rightsBailChip}
          </button>
        </div>
        <div className="composer">
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={t.chatPlaceholder} />
          <button className="btn" type="button" onClick={() => sendText(text)}>
            {t.send}
          </button>
        </div>
      </div>
    </div>
  )
}
