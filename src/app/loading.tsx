export default function Loading() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-8">
            <div className="relative flex h-20 w-20 items-center justify-center">
                {/* Outer ring - Breathing */}
                <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-[ping_3s_ease-in-out_infinite]" />

                {/* Middle ring - Spinning slowly */}
                <div className="absolute inset-2 rounded-full border-t-2 border-primary/40 animate-[spin_4s_linear_infinite]" />

                {/* Inner ring - Spinning fast reverse */}
                <div className="absolute inset-4 rounded-full border-b-2 border-accent/60 animate-[spin_2s_linear_infinite_reverse]" />

                {/* Center dot - Pulse */}
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            </div>

            <div className="text-center space-y-2">
                <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase animate-pulse">
                    Đang chiết xuất dữ liệu...
                </p>
                <p className="text-xs text-muted-foreground/60 font-serif italic">
                    "Kiên nhẫn là đức tính của nhà đầu tư."
                </p>
            </div>
        </div>
    )
}
