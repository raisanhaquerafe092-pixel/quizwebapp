import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "./sw-register";
import ClientAIAssistant from "@/components/ClientAIAssistant";
import PWAInstall from "@/components/PWAInstall";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quiz Web App",
  description: "A quiz web app with installable PWA support.",
  manifest: "/manifest.json",
  applicationName: "Quiz Web App",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Quiz Web App",
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon-192.svg', sizes: '192x192' },
      { url: '/icon-512.svg', sizes: '512x512' }
    ],
    apple: [
      { url: '/apple-touch-icon.svg', sizes: '180x180' }
    ],
  },
};

export const viewport = {
  themeColor: "#0ea5e9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ServiceWorkerRegister />
        {children}
        <PWAInstall />
        <ClientAIAssistant />
      </body>
    </html>
  );
}
