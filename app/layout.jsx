import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import DaftarServiceWorker from "@/components/DaftarServiceWorker";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toko } from "@/lib/toko";

export const metadata = {
  title: toko.nama,
  description: toko.tagline,
  manifest: "/manifest.webmanifest",
  applicationName: toko.nama,
  appleWebApp: { capable: true, title: toko.nama, statusBarStyle: "default" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/icon-192.png" },
};

export const viewport = { themeColor: "#1f6b4f" };

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap"
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Header />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4">{children}</main>
        <Footer />
        <Toaster />
        <DaftarServiceWorker />
      </body>
    </html>
  );
}
