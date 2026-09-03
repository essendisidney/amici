import Link from 'next/link'
import { UssdPhone } from './session'

export default function Ussd() {
  return (
    <>
      <Link className="crumb" href="/citizen">
        Back
      </Link>
      <p className="kicker">Feature phone · Swahili first</p>
      <h1>No smartphone?</h1>
      <p className="lede">
        Same menus on any line. This is a live session, not a poster. The shortcode is a placeholder until Safaricom
        registers it.
      </p>
      <UssdPhone />
      <p className="notice">
        Official filings stay on efiling.court.go.ke.{' '}
        <Link href="/proof">Open an SMS proof pack</Link> · <Link href="/cause-list">Today&apos;s list</Link> ·{' '}
        <Link href="/pay">Lipa</Link>
      </p>
    </>
  )
}
