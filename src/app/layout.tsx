import type { Metadata } from "next";
import { Inter } from "next/font/google";
//
import SessionProviderWrapper from "../utils/session-provider-wrapper";
import MenuAppBar from "@/components/app-bar";
import StoreProvider from "./store-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProviderWrapper>
      <html lang="en">
        <body>
          <StoreProvider>
            <MenuAppBar />
            {children}
          </StoreProvider>
        </body>
      </html>
    </SessionProviderWrapper>
  );
}
