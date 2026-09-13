import { BookMarked } from "lucide-react"
import { GlossaryClient } from "./GlossaryClient"

export const metadata = {
    title: "Thuật ngữ Tài chính (Glossary) – Athena Stock",
    description: "Từ điển giải thích 20 thuật ngữ tài chính và định giá cốt lõi bằng tiếng Việt: P/E, ROE, ROIC, FCF, Moat, Margin of Safety, Owner Earnings, DCF, WACC...",
}

export default function GlossaryPage() {
    return (
        <div className="flex flex-col min-h-screen overflow-x-hidden">
            {/* HERO SECTION (Light/Dark Dynamic Theme with Serene Background) */}
            <section className="relative py-20 md:py-28 overflow-hidden bg-background">
                {/* Serene misty grass background - Light Mode */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-multiply pointer-events-none dark:hidden"
                    style={{ backgroundImage: "url('/images/misty_hero_bg.png')" }}
                />

                {/* Serene misty grass background - Dark Mode */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-screen pointer-events-none hidden dark:block"
                    style={{ backgroundImage: "url('/images/misty_hero_bg_dark.png')" }}
                />

                {/* Gradient overlay to transition smoothly into the dark section below */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-[#090d16] pointer-events-none" />

                <div className="container relative z-10 max-w-4xl text-center space-y-4">
                    <div className="flex justify-center mb-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#e61c5c]/10 text-[#e61c5c] border border-[#e61c5c]/20">
                            <BookMarked className="w-8 h-8" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#9c1850] dark:text-[#faf8f6] leading-tight">
                        Thuật ngữ <span className="text-[#e61c5c] italic font-medium">Tài chính</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-base text-gray-650 dark:text-[#a0a5b5] leading-relaxed font-sans">
                        Giải thích 20 khái niệm và công thức cốt lõi trong định giá, phân tích kinh doanh và tư duy đầu tư giá trị bằng ngôn ngữ trực quan.
                    </p>
                </div>
            </section>

            {/* BODY SECTION (Dark Glassmorphic Theme) */}
            <section className="py-20 md:py-24 bg-[#090d16] text-white relative flex-grow">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#e61c5c]/3 rounded-full blur-[120px] pointer-events-none" />

                <div className="container max-w-5xl relative z-10">
                    <GlossaryClient />
                </div>
            </section>
        </div>
    )
}
