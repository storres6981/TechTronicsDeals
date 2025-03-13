'use client';

import Navbar from "./components/layout/Navbar";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </>
  );
}