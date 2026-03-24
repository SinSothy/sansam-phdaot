import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { AdminLayout } from '@/components/layout/AdminLayout'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' })

export const metadata: Metadata = {
  title: 'Architect Pro | Kanban Clarity',
  description: 'Manage daily tasks and operations efficiently',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className={`${inter.variable} ${jakarta.variable} bg-background font-body text-on-background selection:bg-primary-container selection:text-on-primary-container antialiased`}>
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  )
}
