"use client"

import Script from "next/script"
import { useEffect, useRef } from "react"

declare global {
    interface Window {
        turnstile?: {
            render: (container: HTMLElement, options: {
                sitekey: string
                theme?: "light" | "dark" | "auto"
                callback: (token: string) => void
                "expired-callback": () => void
                "error-callback": () => void
            }) => string
            remove: (widgetId: string) => void
        }
    }
}

interface TurnstileWidgetProps {
    siteKey?: string
    onToken: (token: string) => void
    resetKey?: number
}

export function TurnstileWidget({ siteKey, onToken, resetKey = 0 }: TurnstileWidgetProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef<string | null>(null)

    const renderWidget = () => {
        if (!siteKey || !containerRef.current || !window.turnstile || widgetIdRef.current) return
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme: "dark",
            callback: onToken,
            "expired-callback": () => onToken(""),
            "error-callback": () => onToken(""),
        })
    }

    useEffect(() => {
        renderWidget()
        return () => {
            if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current)
            widgetIdRef.current = null
        }
        // resetKey intentionally forces a fresh one-time challenge after submit.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [siteKey, onToken, resetKey])

    if (!siteKey) {
        if (process.env.NODE_ENV !== "production") return null
        return <p className="text-xs text-red-400">Thiếu cấu hình xác minh chống spam.</p>
    }

    return (
        <>
            <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                strategy="afterInteractive"
                onLoad={renderWidget}
            />
            <div ref={containerRef} className="min-h-[65px]" />
        </>
    )
}
