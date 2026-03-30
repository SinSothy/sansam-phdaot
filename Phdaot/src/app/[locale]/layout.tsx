import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import '../globals.css'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { Toaster } from 'sonner'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' })

export const metadata: Metadata = {
  title: 'Architect Pro | Kanban Clarity',
  description: 'Manage daily tasks and operations efficiently',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  // Ensure that the incoming `locale` is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${jakarta.variable} bg-background font-body text-on-background selection:bg-primary-container selection:text-on-primary-container antialiased`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Toaster position="top-right" richColors closeButton />
          <AdminLayout>{props.children}</AdminLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

