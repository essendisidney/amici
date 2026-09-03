'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { copy, type Lang } from '@/lib/i18n'

const Ctx = createContext<{ lang: Lang; t: (typeof copy)[Lang]; setLang: (l: Lang) => void } | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const value = useMemo(() => ({ lang, setLang, t: copy[lang] }), [lang])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useLang() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLang')
  return ctx
}
