import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Configura a fonte
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
});

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={jakarta.className}>
      <body className="bg-slate-50 text-slate-800 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}