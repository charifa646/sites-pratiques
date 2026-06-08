import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cadran - Réservation et paiement pour coachs francophones',
  description:
    'Cadran simplifie la prise de rendez-vous et le paiement mobile pour les coachs et consultants en Afrique francophone. Wave, Orange Money, zéro no-show.',
  metadataBase: new URL('https://cadran.app'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body
        style={
          {
            '--font-geist-sans': GeistSans.style.fontFamily,
            '--font-geist-mono': GeistMono.style.fontFamily,
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  )
}
