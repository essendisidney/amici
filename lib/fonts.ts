import { Atkinson_Hyperlegible_Next, Bricolage_Grotesque, IBM_Plex_Mono } from 'next/font/google'

export const display = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  weight: 'variable',
  variable: '--font-display',
  display: 'swap',
})

export const sans = Atkinson_Hyperlegible_Next({
  subsets: ['latin', 'latin-ext'],
  weight: 'variable',
  variable: '--font-sans',
  display: 'swap',
})

export const mono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})
