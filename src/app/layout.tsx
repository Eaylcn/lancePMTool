import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lance",
  description:
    "Analyze mobile games, get AI mentor feedback, and grow your Gaming PM career.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
