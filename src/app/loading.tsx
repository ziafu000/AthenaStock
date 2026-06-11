export default function Loading() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-6">
            <div className="relative flex h-16 w-16 items-center justify-center">
                {/* Elegant glow effect */}
                <div className="absolute inset-0 rounded-full bg-accent/5 blur-md" />
                
                {/* Outer pulsing ring */}
                <div className="absolute inset-0 rounded-full border border-accent/20 animate-pulse" />
                
                {/* Spinning premium ring */}
                <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-accent/60 border-l-accent/25 animate-spin" style={{ animationDuration: '0.8s' }} />
                
                {/* Center static anchor */}
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            </div>

            <div className="text-center space-y-3">
                <p className="text-xs font-semibold tracking-widest text-accent uppercase animate-pulse font-sans">
                    Đang tải trang...
                </p>
                <p className="text-xs text-muted-foreground/70 font-serif italic">
                    &quot;Thị trường chứng khoán là công cụ chuyển tiền từ túi người thiếu kiên nhẫn sang túi người kiên nhẫn.&quot;
                </p>
            </div>
        </div>
    )
}
