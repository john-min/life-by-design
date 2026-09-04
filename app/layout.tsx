import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Life by Design — A guided reflection",
    template: "%s · Life by Design",
  },
  description:
    "Explore the ideas behind Designing Your Life and imagine more than one meaningful future.",
  applicationName: "Life by Design",
  category: "education",
  openGraph: {
    type: "website",
    title: "Life by Design — A guided reflection",
    description:
      "Learn the high-level Designing Your Life framework, notice what gives you energy, and begin a light reflection.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#72c7ce",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
