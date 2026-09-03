import { caseCache } from '@/lib/cases'
import { demoLockoutSms } from '@/lib/evidence-sms'
import { hearingSms } from '@/lib/hearing-sms'

export type UssdResult = { type: 'CON' | 'END'; text: string }

const lawyers: Record<string, string> = {
  '1': 'Wambui Njoroge, Nairobi. KSh 4,500. LSK checked. Piga 4 kulipa amana 1,500.',
  '2': 'Peter Otieno, Kisumu. KSh 6,000. Ardhi na mirathi. Piga 4.',
  '3': 'Amina Hassan, Mombasa. KSh 3,000. Dhamana. Piga 4.',
}

export function ussdStep(session: string[], input: string): { session: string[]; screen: UssdResult } {
  const key = input.trim()
  if (key === '*483*54#' || key === '') {
    return {
      session: [],
      screen: {
        type: 'CON',
        text: 'AMICI\n1 Haki\n2 Wakili\n3 Kesi\n4 Risiti\n0 Funga',
      },
    }
  }

  const next = [...session, key]
  const path = next.join('.')

  if (key === '0' && session.length === 0) {
    return { session: [], screen: { type: 'END', text: 'Asante. Amici si Mahakama.' } }
  }
  if (key === '0') {
    return ussdStep([], '*483*54#')
  }

  if (session.length === 0) {
    if (key === '1') {
      return {
        session: next,
        screen: { type: 'CON', text: 'HAKI (si ushauri)\n1 Nyumba/panga\n2 Polisi/dhamana\n3 Dharura\n0 Rudi' },
      }
    }
    if (key === '2') {
      return {
        session: next,
        screen: { type: 'CON', text: 'TAFUTA WAKILI\n1 Nairobi\n2 Kisumu\n3 Mombasa\n0 Rudi' },
      }
    }
    if (key === '3') {
      return {
        session: next,
        screen: { type: 'CON', text: 'KESI (si CTS)\n1 HCCC/1234/2023\n2 SCCC/441/2026\n0 Rudi' },
      }
    }
    if (key === '4') {
      return {
        session: next,
        screen: {
          type: 'CON',
          text: 'RISITI / SMS\n1 Amana wakili 1500\n2 Dhamana (si release order)\n3 SMS ya kusikia kesi\n4 Ushahidi wa kufuli\n0 Rudi',
        },
      }
    }
    return { session: [], screen: { type: 'CON', text: 'Chaguo si sahihi.\n1 Haki\n2 Wakili\n3 Kesi\n4 Risiti' } }
  }

  if (path === '1.1') {
    return {
      session: [],
      screen: {
        type: 'END',
        text: 'Mwenye nyumba hawezi kukufunga nje bila amri katika hali nyingi. Andika tarehe + risiti. Piga 4 kisha 4 kwa SMS ya ushahidi. Piga 2 kwa wakili. Si ushauri.',
      },
    }
  }
  if (path === '1.2') {
    return {
      session: [],
      screen: {
        type: 'END',
        text: 'Ikiwa ulilipa dhamana na CTS ikashindwa, weka risiti ya M-PESA. Piga 4 kupata SMS ya Amici. Amri ya kuachiliwa bado inatoka mahakamani.',
      },
    }
  }
  if (path === '1.3') {
    return { session: [], screen: { type: 'END', text: 'Toka. Piga 999 au nenda polisi. Amici haitoi ushauri wa dharura.' } }
  }

  if (session[0] === '2' && lawyers[key]) {
    return { session: [], screen: { type: 'END', text: lawyers[key] } }
  }

  if (session[0] === '3') {
    const num = key === '1' ? 'HCCC/1234/2023' : key === '2' ? 'SCCC/441/2026' : key.toUpperCase()
    const c = caseCache[num]
    if (!c) {
      return { session: [], screen: { type: 'END', text: 'Hakuna cache. Fungua CTS rasmi au uliza wakili nambari ya e-filing.' } }
    }
    return {
      session: [],
      screen: { type: 'END', text: hearingSms(num, true) },
    }
  }

  if (path === '4.1') {
    return {
      session: [],
      screen: { type: 'END', text: 'SMS: AMICI-HOLD 1500 kwa Wambui Njoroge. Paybill 400200 Acc AMICI-DEP. Si malipo ya mahakama.' },
    }
  }
  if (path === '4.2') {
    return {
      session: [],
      screen: {
        type: 'END',
        text: 'SMS: AMICI-PROOF CR/2201/2026 M-PESA XXX. Hii si amri ya kuachiliwa. Clerk bado atathibitisha kwenye CTS.',
      },
    }
  }
  if (path === '4.3') {
    return {
      session: next,
      screen: { type: 'CON', text: 'SMS YA KESI\n1 HCCC/1234/2023\n2 SCCC/441/2026\n0 Rudi' },
    }
  }
  if (path === '4.3.1') {
    return { session: [], screen: { type: 'END', text: hearingSms('HCCC/1234/2023', true) } }
  }
  if (path === '4.3.2') {
    return { session: [], screen: { type: 'END', text: hearingSms('SCCC/441/2026', true) } }
  }
  if (path === '4.4') {
    return { session: [], screen: { type: 'END', text: demoLockoutSms(true) } }
  }

  return ussdStep([], '*483*54#')
}
