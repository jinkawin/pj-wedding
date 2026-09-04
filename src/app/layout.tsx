import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jinkawin & Parima — Wedding Invitation',
  description: 'You are cordially invited to celebrate the wedding of Jinkawin P and Parima S.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

