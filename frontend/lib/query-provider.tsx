'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Skapa en QueryClient-instans utanför komponenten
const queryClient = new QueryClient()

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
} 