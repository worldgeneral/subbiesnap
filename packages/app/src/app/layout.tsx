import type { Metadata } from "next";

import { Providers } from "./providers";
import "../assets/scss/tailwind.scss";
import "../assets/@iconscout/unicons/css/line.css";
import "../assets/@mdi/font/css/materialdesignicons.min.css";

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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
