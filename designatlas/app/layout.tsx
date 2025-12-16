import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'DesignAtlas - Türkçe UX/UI Öğrenme Platformu',
  description: 'Kendi hızında, kendi yolunda tasarımı öğren.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}