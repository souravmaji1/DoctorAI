'use client'


import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "@/components/ui/sonner"
import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  LayoutGrid, 
  Bot, 
  Workflow, 
  Rocket, 
  Users2,
  Map,
  Book,
  Settings,
  Music, 
  Combine,
  Zap,
  X,
  Shield,
  ChevronRight,
  ArrowRight,
  Menu
} from 'lucide-react'


const siteConfig = {
  name: 'Doctorify',
  description: 'Doctorify is a AI tools platform for patients to get doctor consultaion for their health issues quick and efficitent way',
  keywords: ['AI', 'AI doctor', 'health doctor'],
  authors: [{ name: 'Doctorify Team' }],
  creator: 'Doctorify',
  themeColor: '#22D3EE',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
}




export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <title>{siteConfig.name}</title>
        </head>
        <body>
         
              <main className="">
                {children}
              </main>
          
        </body>
      </html>
    </ClerkProvider>
  )
}