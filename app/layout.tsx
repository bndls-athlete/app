import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ReactQueryProviderWrapper from "@/context/QueryProvider";
import { ToastProvider } from "@/context/ToastProvider";
import { AthleteCardProvider } from "@/context/AthleteCardProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BNDLS - Boundless: The Athlete-Brand Marketplace",
  description:
    "Discover boundless opportunities on BNDLS, the leading marketplace connecting athletes and teams with top brands for career opportunities. Whether you're an athlete seeking your next challenge or a brand looking to hire exceptional talent, BNDLS is your destination to bridge ambition with opportunity.",
  keywords:
    "athlete marketplace, sports careers, brand partnerships, athlete jobs, team hiring, athlete branding, sports industry, athlete endorsements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProviderWrapper>
      <ClerkProvider>
        <AthleteCardProvider>
          <html lang="en">
            <body className={inter.className}>
              <ToastProvider> {children} </ToastProvider>
            </body>
          </html>
        </AthleteCardProvider>
      </ClerkProvider>
    </ReactQueryProviderWrapper>
  );
}
