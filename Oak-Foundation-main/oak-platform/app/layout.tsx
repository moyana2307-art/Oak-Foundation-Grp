import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import AppNav from "./components/AppNav";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OAK Foundation | Partner Convening 2026",
  description:
    "Register, check in, view the programme and partner directory for the OAK Foundation Partner Convening 2026 in Harare.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AppNav />
        <main className="flex-1 pb-[88px] lg:pl-[264px] lg:pb-10">{children}</main>
      </body>
    </html>
  );
}
