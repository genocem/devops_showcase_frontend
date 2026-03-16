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
        <div className="app-shell">
          <Navigation />
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
