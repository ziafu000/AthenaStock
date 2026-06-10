import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google"; // Import Serif font
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/Header"; // Updated import
import { Footer } from "../components/layout/Footer"; // Updated import
import { ReadingProvider } from "@/components/reading/ReadingContext"; // Updated import
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from '@vercel/speed-insights/next';


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        template: "%s | Đầu tư tỉnh thức",
        default: siteConfig.title,
    },
    description: siteConfig.description,
    keywords: ["đầu tư giá trị", "warren buffett", "tâm lý đầu tư", "chứng khoán", "dài hạn"],
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: siteConfig.locale,
        url: "/",
        siteName: siteConfig.name,
        title: siteConfig.title,
        description: siteConfig.description,
        images: [
            {
                url: "/logo.png",
                width: 512,
                height: 512,
                alt: siteConfig.name,
            },
        ],
    },
    twitter: {
        card: "summary",
        title: siteConfig.title,
        description: siteConfig.description,
        images: ["/logo.png"],
    },
    icons: {
        icon: "/logo.png",
        apple: "/logo.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi" suppressHydrationWarning>
            <body className={cn(
                "min-h-screen bg-background font-sans antialiased",
                inter.variable,
                playfair.variable
            )}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <ReadingProvider>
                        <div className="relative flex min-h-screen flex-col bg-background selection:bg-accent/20 selection:text-accent-foreground">
                            <Header />
                            <main className="flex-1">{children}</main>
                            <Footer />
                        </div>
                    </ReadingProvider>
                </ThemeProvider>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
