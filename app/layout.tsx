import type { Metadata } from 'next'
import { LangProvider } from '@/components/Lang'
import { Shell } from '@/components/Shell'
import { display, mono, sans } from '@/lib/fonts'
import { createClient } from '@/lib/supabase/server'
import { hasEnvVars } from '@/lib/utils'
import './globals.css'

export const metadata: Metadata = {
  title: 'Amici',
  description: 'Independent access layer for Kenyan justice. Not the official Case Tracking System.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let signedIn = false
  if (hasEnvVars) {
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()
    signedIn = Boolean(data?.claims)
  }

  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <LangProvider>
          <Shell signedIn={signedIn}>
            {children}
          </Shell>
        </LangProvider>
      </body>
    </html>
  )
}
