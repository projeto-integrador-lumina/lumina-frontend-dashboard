import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
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
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#ffffff",
              color: "#2D3748",
              borderRadius: "16px",
              padding: "12px 20px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              fontFamily: "var(--font-jakarta)",
            },
            success: {
              iconTheme: {
                primary: "#5FDBD7",
                secondary: "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#EB877C",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}