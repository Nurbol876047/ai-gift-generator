'use client'

import { SessionProvider } from 'next-auth/react'
import { NextIntlClientProvider } from 'next-intl'
import { useLocale } from 'next-intl'

export function Providers({ children }: { children: React.ReactNode }) {
  const locale = useLocale()
  
  return (
    <SessionProvider>
      <NextIntlClientProvider locale={locale}>
        {children}
      </NextIntlClientProvider>
    </SessionProvider>
  )
}

