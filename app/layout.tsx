import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Full Authentication System",
  description:
    "Full Authentication System with NextJs, Oauth, FastApi , Redis and Postgres",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
