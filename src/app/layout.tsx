import type { Metadata } from "next";
import { PT_Serif } from "next/font/google";
import "./globals.css";
import "react-photo-view/dist/react-photo-view.css";
import Header from "@/modules/layout/header";
import AnnouncementBar from "@/modules/layout/announcement-bar";
import Footer from "@/modules/layout/footer";

const ptSerif = PT_Serif({
  variable: "--font-pt-serif",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | SCZG Eventi",
    default: "SCZG Eventi",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr">
      <body className={`${ptSerif.variable} antialiased`}>
        <AnnouncementBar />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
