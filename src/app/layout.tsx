import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components";

export const metadata: Metadata = {
  title: "DevOps Showcase",
  description: "Microservices testing frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main style={{ padding: '20px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
