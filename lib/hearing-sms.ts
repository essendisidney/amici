import { caseCache } from '@/lib/cases'
import { hearingFor } from '@/lib/cause-list'

export function hearingSms(number: string, sw = true) {
  const n = number.trim().toUpperCase()
  const hearing = hearingFor(n)
  const c = caseCache[n]
  const parties = c?.title ?? hearing?.parties ?? ''

  if (!hearing) {
    return sw
      ? `AMICI (si CTS)\n${n}\n${parties}\nBado haiko kwenye orodha yetu.\nThibitisha CTS kabla ya kusafiri.`
      : `AMICI (not CTS)\n${n}\n${parties}\nNot on our cause list yet.\nConfirm official CTS before you travel.`
  }

  return sw
    ? `AMICI (si CTS)\n${n}\n${parties}\n${hearing.date} ${hearing.time}\n${hearing.court}\nChumba ${hearing.room}\nThibitisha orodha rasmi kabla ya kusafiri.`
    : `AMICI (not CTS)\n${n}\n${parties}\n${hearing.date} ${hearing.time}\n${hearing.court}\nRoom ${hearing.room}\nConfirm the official list before you travel.`
}

export function smsHref(body: string) {
  return `sms:?body=${encodeURIComponent(body)}`
}

export function waHref(body: string) {
  return `https://wa.me/?text=${encodeURIComponent(body)}`
}
