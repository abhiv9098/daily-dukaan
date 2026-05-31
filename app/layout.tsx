import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HisaabProvider } from "@/context/hisaab-context";
import { FilterProvider } from "@/context/filter-context";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Agentation } from "agentation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daily Dukaan Hisaab",
  description: "Modern Business Accounting for Shop Owners",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-background">
        <HisaabProvider>
          <FilterProvider>
            <ThemeProvider>
              {children}
              <Agentation />
            </ThemeProvider>
          </FilterProvider>
        </HisaabProvider>
      </body>
    </html>
  );
}
