import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "arc-intent-terminal",
  description: "Arc Testnet builder terminal for browser-confirmed trade intents, simulation, and explorer-verifiable workflow."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
