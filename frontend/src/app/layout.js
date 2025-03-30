import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ZapQ",
  description: "Explore data tables with ease.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ThemeProvider>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
      </ThemeProvider>
    </html>
  );
}
