'use client'

import Link from 'next/link'
import { useLang } from '@/components/Lang'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/actions'

const links = [
  { href: '/citizen', key: 'citizen' as const },
  { href: '/desk', key: 'desk' as const },
  { href: '/practice', key: 'lawyer' as const },
  { href: '/integrity', key: 'integrity' as const },
  { href: '/ussd', key: 'ussd' as const },
]

export function Shell({
  children,
  signedIn,
}: {
  children: React.ReactNode
  signedIn: boolean
}) {
  const { lang, setLang, t } = useLang()
  const pathname = usePathname()

  return (
    <div className="shell">
      <header className="topbar">
        <Link href="/" className="brand-lock">
          <span className="mark">A</span>
          <span>
            <span className="brand">{t.brand}</span>
            <small>Friend of the court</small>
          </span>
        </Link>
        <div className="tools">
          {signedIn ? (
            <>
              <Link href="/account">Account</Link>
              <form action={signOut}>
                <button className="btn ghost" type="submit">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link className="btn" href="/login">
              {t.login}
            </Link>
          )}
          <div className="lang" role="group" aria-label="Language">
            <button type="button" className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>
              EN
            </button>
            <button type="button" className={lang === 'sw' ? 'on' : ''} onClick={() => setLang('sw')}>
              SW
            </button>
          </div>
        </div>
      </header>
      <nav className="nav">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={pathname.startsWith(l.href) ? 'page' : undefined}
          >
            {t[l.key]}
          </Link>
        ))}
      </nav>
      <main className="page">{children}</main>
      <div className="dock">
        <Link className="btn" href="/rights">
          Haki
        </Link>
        <Link className="btn ghost" href="/lawyers">
          Wakili
        </Link>
        <Link className="btn ghost" href="/track">
          Kesi
        </Link>
        <Link className="btn ghost" href="/ussd">
          *#
        </Link>
      </div>
    </div>
  )
}
