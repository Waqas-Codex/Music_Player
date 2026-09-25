import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/components/ReduxProvider";
import { AuthInitializer } from "@/components/AuthInitializer";
import { LayoutContent } from "@/components/LayoutContent";

export const metadata: Metadata = {
  title: "chuchify",
  description: "Music app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ReduxProvider>
          <AuthInitializer />
          <LayoutContent>{children}</LayoutContent>
        </ReduxProvider>
      </body>
    </html>
  );
}