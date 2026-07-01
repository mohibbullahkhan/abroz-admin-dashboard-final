import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/components/providers/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abroz Parts+ | Admin Dashboard",
  description: "Admin Portal for AB & KBROZ MACHINERY INC. - Heavy Equipment Spare Parts & Machinery",
  icons: {
    icon: "/Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased white`}
    >
      <body className="min-h-full flex flex-col selection:bg-primary/30 selection:text-primary">
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
