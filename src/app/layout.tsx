import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { LayoutProvider } from "@/providers/layout-provider";
import ClientLayout from "./client-layout";
import { AuthErrorBoundary } from "@/components/auth-error-boundary";
import { Analytics } from "@vercel/analytics/next"

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: 'swap'
})

export const metadata: Metadata = {
  title: "LogiFun - Logic Gate Learning",
  description: "Interactive Logic Gate Learning Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <AuthErrorBoundary>
          <ClientLayout>
            <LayoutProvider>
              {children}
              <Analytics />
            </LayoutProvider>
          </ClientLayout>
        </AuthErrorBoundary>
      </body>
    </html>
  );
}
