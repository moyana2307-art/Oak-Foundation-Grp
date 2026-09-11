import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import AppNav from "./components/AppNav";
import ShellMain from "./components/ShellMain";
import { getSession } from "@/lib/auth";
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
  const session = await getSession();
  return (
    <html
      lang="en"
      className={`${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AppNav role={session?.role ?? null} />
        <ShellMain>{children}</ShellMain>
      </body>
    </html>
  );
}
