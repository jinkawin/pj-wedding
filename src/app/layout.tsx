import type { Metadata } from 'next'
import Navbar from '@/components/navigation/Navbar'
import { I18nProvider } from '@/locale/I18nContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'Parima & Jinkawin  — Wedding Invitation',
  description: 'You are cordially invited to celebrate the wedding of Parima S and Jinkawin P',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <Navbar />
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}


