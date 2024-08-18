import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/header";
import PageWrap from "@/components/containers/pageWrap";
import { CopyRightFooter } from "@/components/footer/copyRightFooter";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Subbie Snap",
  description:
    "an app for the construction industry, where solo traders offer there time to companies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <PageWrap>
            <Header />
            {children}
            <CopyRightFooter />
          </PageWrap>
        </Providers>
      </body>
    </html>
  );
}
