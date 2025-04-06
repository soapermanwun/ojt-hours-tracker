import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OJT Hours Tracker",
  description: "A simple website for tracking ojt hours rendered by students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <footer className="p-3 text-center">
          <p>
            Built with NextJS + TailwindCSS by{" "}
            <span>
              <a
                className="underline hover:text-red-600"
                href="https://www.facebook.com/xxxjustentacion/"
              >
                Justine Ivan Gueco
              </a>
            </span>
          </p>
        </footer>
      </body>
    </html>
  );
}
