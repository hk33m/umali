import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/providers/cart-provider";
import "./globals.css";


export const metadata = {
  metadataBase: new URL("https://umalibakery.vercel.app"),

  title: {
    default: "مخبز أم علي | umalibakery  ",
    template: "%s | مخبز أم علي",
  },

  description:
   " مخبوزاتنا تُحضّر من البر الصحي بدل الدقيق الأبيض، وتُخبز بأيدي أمهات يضعن في كل رغيف شيئًا من حب البيت ودفء المائدة.",
  keywords: [
    "مخبز أم علي",
    "مخبز ام علي",
    "مخبز أم علي إب",
    "مخبز ام علي إب",
    "مخبز في إب",
    "مخابز إب",
    "مخبوزات إب",
    "حلويات إب",
    "مخبوزات طازجة",
    "حلويات طازجة",
    "مخبوزات وحلويات",
    "مخبز",
    "حلويات",
  ],

  authors: [
    {
      name: "مخبز أم علي",
    },
  ],

  creator: "مخبز أم علي",
  publisher: "مخبز أم علي",

  applicationName: "مخبز أم علي",

  category: "food",

  alternates: {
    canonical: "https://umalibakery.vercel.app",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  verification: {
    google: "qnHPSCgzi3-qMeczL8xk98I8DyzALII2aAzPikQdMJw",
  },

  openGraph: {
    type: "website",
    locale: "ar_YE",
    url: "https://umalibakery.vercel.app",
    siteName: "مخبز أم علي",
    title: "مخبز أم علي | umalibakery  ",
    description:
      "  مخبوزات أم علي المنزلية، تُخبز يوميًا بعناية وبأجود المكونات لتقدم لك مذاقًا طازجًا وأصيلًا.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "مخبز أم علي",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "مخبز أم علي | umalibakery  ",
    description:
      "مخبز أم علي يقدم المخبوزات والحلويات الطازجة بأجود المكونات.",
    images: ["/og-image.jpg"],
  },

  appleWebApp: {
    capable: true,
    title: "مخبز أم علي",
    statusBarStyle: "default",
  },

  icons: {
    icon: [
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: {
      url: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
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
