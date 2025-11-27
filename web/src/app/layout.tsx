import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Image from "next/image";
import styles from "./barang/barang.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* header */}
        <header className={styles.header}>
          {/* <img src="./images/logo.png"/> */}
          <Image
            src={"/images/logo.png"}
            alt="Logo"
            width={320}
            height={60}
            priority
          />
        </header>

        {children}
        <Toaster position="top-center" toastOptions={{
          style : {
            backgroundColor: "#555555",
            color: "#FFFFFF"
          }
        }}/>

        {/* footer */}
        <footer className={styles.footer}>&copy; 2025 - IF 23 E</footer>
      </body>
    </html>
  );
}
