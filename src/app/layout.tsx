import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google"; // Import Serif font
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/Header"; // Updated import
import { Footer } from "../components/layout/Footer"; // Updated import
import { ReadingProvider } from "@/components/reading/ReadingContext"; // Updated import
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
    title: {
        template: "%s | Đầu tư tỉnh thức",
        default: "Athena Stock - Đầu tư tỉnh thức",
    },
    description: "Hoạch định hành trình đầu tư bền vững, hiểu đúng bản chất doanh nghiệp và kiểm soát tâm lý hành vi.",
    keywords: ["đầu tư giá trị", "warren buffett", "tâm lý đầu tư", "chứng khoán", "dài hạn"],
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
            </body>
        </html>
    );
}
