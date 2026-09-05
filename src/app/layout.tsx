import type { Metadata } from 'next'
import Navbar from '@/components/navigation/Navbar'
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
        <Navbar />
        {children}
      </body>
    </html>
  )
}

