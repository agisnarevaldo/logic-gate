import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { LayoutProvider } from "@/providers/layout-provider";
import { AuthProvider } from "@/hooks/useAuth";
import { ProgressionProvider } from "@/providers/progression-provider";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: 'swap'
})

export const metadata: Metadata = {
  title: "LogiFun - Pembelajaran Gerbang Logika",
  description: "Aplikasi pembelajaran interaktif untuk memahami gerbang logika",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <AuthProvider>
          <ProgressionProvider>
            <LayoutProvider>
              {children}
            </LayoutProvider>
          </ProgressionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
