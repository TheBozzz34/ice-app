import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import "./globals.css";
import NavBar from "@/components/NavBar/NavBar.component";
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Wheeler Peak Ice",
  description: "Wheeler Peak Ice is a company",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <TooltipProvider
          delayDuration={200}
        ><Analytics/><SpeedInsights/>
        {children}
        </TooltipProvider>
        </body>
    </html>
  );
}
