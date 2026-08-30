import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FoodSignal",
  description:
    "Know what is in your food. Understand the evidence. (Prototype)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
