import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/providers/cart-provider";
import "./globals.css";

export const metadata = {
  title: "مخبز أم علي المميز",
  description:
    "منتجات مخبز أم علي بجودة عالية مستوحاة من الطبيعة والأطعمة الشرقية الأصيلة",

  applicationName: "مخبز أم علي",

  appleWebApp: {
    capable: true,
    title: "مخبز أم علي",
    statusBarStyle: "default",
  },

  icons: {
    icon: [
      {
        url: "/favicon-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>{children}</CartProvider>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
