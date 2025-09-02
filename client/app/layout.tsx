import Providers from "./providers";
import "./globals.css";
import Topbar from "./components/Topbar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  title: "Car Auction",
  description: "Live car auctions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Providers>
          <Topbar />
          <Navbar />
          <div className="w-full mx-auto">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
