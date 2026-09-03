import { causeDays } from '@/lib/cause-list'
import { inferMatterTags } from '@/lib/intake'

export type Watch = { number: string; title: string; court: string }
export type ChatLine = { from: 'me' | 'them'; text: string; at: string }
export type MatterStatus = 'pending' | 'accepted' | 'closed'
export type Matter = {
  id: string
  advocate: string
  matter: string
  clientName?: string | null
  town?: string | null
  opponent?: string | null
  receiptRef?: string | null
  evidenceNote?: string | null
  status: MatterStatus
  messages: ChatLine[]
}
export type Ping = { id: string; text: string; href: string; at: string }

type FileState = { watches: Watch[]; matters: Matter[]; pings: Ping[] }

const KEY = 'amici-file-v1'

const seed: FileState = {
  watches: [{ number: 'HCCC/1234/2023', title: 'Mwangi v City Council', court: 'Milimani High Court, Civil' }],
  matters: [
    {
      id: 'm-grace',
      advocate: 'Wambui Njoroge',
      matter: 'Landlord locked her out — Kahawa West',
      clientName: 'Grace Muthoni',
      town: 'Kahawa West',
      opponent: 'Landlord / property manager',
      receiptRef: 'QJM4X8P2',
      evidenceNote: 'Rent M-PESA receipt and photo of the changed lock to be confirmed.',
      status: 'accepted',
      messages: [
        { from: 'me', text: 'He changed the locks on 28 Aug after I paid August rent.', at: '2026-09-01T09:12:00' },
        { from: 'them', text: 'Send the M-PESA rent receipt and a photo of the door. Do not go back alone.', at: '2026-09-01T09:40:00' },
      ],
    },
  ],
  pings: [],
}

function empty(): FileState {
  return { watches: [], matters: [], pings: [] }
}

export function loadFile(): FileState {
  if (typeof window === 'undefined') return seed
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      const first = { ...seed, pings: hearingPings(seed.watches) }
      localStorage.setItem(KEY, JSON.stringify(first))
      return first
    }
    const parsed = JSON.parse(raw) as FileState
    return {
      watches: parsed.watches ?? [],
      matters: parsed.matters ?? [],
      pings: parsed.pings ?? [],
    }
  } catch {
    return empty()
  }
}

function save(state: FileState) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function hearingPings(watches: Watch[]): Ping[] {
  const hits: Ping[] = []
  for (const day of causeDays) {
    for (const row of day.rows) {
      if (watches.some((w) => w.number === row.number)) {
        hits.push({
          id: `hear-${row.number}`,
          text: `${row.number} · ${day.date} ${row.time} · ${day.court} room ${row.room}`,
          href: '/cause-list',
          at: day.date,
        })
      }
    }
  }
  return hits
}

export function addWatch(watch: Watch) {
  const state = loadFile()
  if (!state.watches.some((w) => w.number === watch.number)) state.watches.unshift(watch)
  state.pings = hearingPings(state.watches)
  save(state)
  return state
}

export function openMatter(advocate: string, matter: string) {
  const state = loadFile()
  const id = `m-${Date.now().toString(36)}`
  const tags = inferMatterTags(matter)
  const item: Matter = {
    id,
    advocate,
    matter,
    town: tags.town,
    opponent: tags.opponent,
    status: 'pending',
    messages: [{ from: 'me', text: matter, at: new Date().toISOString() }],
  }
  state.matters.unshift(item)
  save(state)
  return item
}

export function getMatter(id: string) {
  return loadFile().matters.find((m) => m.id === id) ?? null
}

export function addLine(id: string, from: ChatLine['from'], text: string) {
  const state = loadFile()
  const matter = state.matters.find((m) => m.id === id)
  if (!matter) return null
  matter.messages.push({ from, text, at: new Date().toISOString() })
  save(state)
  return matter
}

export function setMatterStatus(id: string, status: MatterStatus) {
  const state = loadFile()
  const matter = state.matters.find((m) => m.id === id)
  if (!matter) return null
  matter.status = status
  save(state)
  return matter
}

export function setMatterDetails(
  id: string,
  details: {
    clientName?: string | null
    town?: string | null
    opponent?: string | null
    receiptRef?: string | null
    evidenceNote?: string | null
  },
) {
  const state = loadFile()
  const matter = state.matters.find((m) => m.id === id)
  if (!matter) return null
  matter.clientName = details.clientName?.trim() || null
  matter.town = details.town?.trim() || null
  matter.opponent = details.opponent?.trim() || null
  matter.receiptRef = details.receiptRef?.trim() || null
  matter.evidenceNote = details.evidenceNote?.trim() || null
  save(state)
  return matter
}
