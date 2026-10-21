import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kosinaja - Jasa Penitipan Barang Mahasiswa Padang",
  description: "Layanan penitipan barang kos aman, praktis & terpercaya untuk mahasiswa di Kota Padang.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body className="antialiased bg-[#FAF6F0] text-[#2A1B14] selection:bg-[#B86B35] selection:text-white">
        {children}
      </body>
    </html>
  );
}
