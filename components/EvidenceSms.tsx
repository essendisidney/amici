'use client'

import { evidenceSms } from '@/lib/evidence-sms'
import { smsHref, waHref } from '@/lib/hearing-sms'
import { useLang } from '@/components/Lang'
import type { Matter } from '@/lib/file-store'
import { useMemo, useState } from 'react'

type PackMatter = Pick<
  Matter,
  'advocate' | 'matter' | 'clientName' | 'town' | 'opponent' | 'receiptRef' | 'evidenceNote' | 'messages'
>

export function EvidenceSms({ matter, compact }: { matter: PackMatter; compact?: boolean }) {
  const { t, lang } = useLang()
  const body = useMemo(() => evidenceSms(matter, lang === 'sw'), [matter, lang])
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard?.writeText(body)
    setCopied(true)
  }

  if (compact) {
    return (
      <span className="composer" style={{ marginTop: 8, flexWrap: 'wrap' }}>
        <button className="btn ghost" type="button" onClick={copy}>
          {copied ? t.copied : t.copySms}
        </button>
        <a className="btn ghost" href={smsHref(body)}>
          {t.sendSms}
        </a>
        <a className="btn ghost" href={waHref(body)} target="_blank" rel="noreferrer">
          {t.whatsapp}
        </a>
      </span>
    )
  }

  return (
    <>
      <article className="sms">
        <div className="phone-net">+254 7XX · Inbox</div>
        <pre>{body}</pre>
      </article>
      <div className="composer" style={{ marginBottom: 12, flexWrap: 'wrap' }}>
        <button className="btn" type="button" onClick={copy}>
          {copied ? t.copied : t.copySms}
        </button>
        <a className="btn ghost" href={smsHref(body)}>
          {t.sendSms}
        </a>
        <a className="btn ghost" href={waHref(body)} target="_blank" rel="noreferrer">
          {t.whatsapp}
        </a>
      </div>
    </>
  )
}
