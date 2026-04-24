"use client"

import React, { createContext, useContext, useState } from "react"

type FontSize = "normal" | "large"
type LineWidth = "normal" | "wide"

interface ReadingContextType {
    fontSize: FontSize
    setFontSize: (size: FontSize) => void
    lineWidth: LineWidth
    setLineWidth: (width: LineWidth) => void
    isFocusMode: boolean
    toggleFocusMode: () => void
}

const ReadingContext = createContext<ReadingContextType | undefined>(undefined)

function readStoredOption<T extends string>(key: string, fallback: T, allowedValues: readonly T[]) {
    if (typeof window === "undefined") return fallback

    const storedValue = window.localStorage.getItem(key)
    return allowedValues.includes(storedValue as T) ? (storedValue as T) : fallback
}

export function ReadingProvider({ children }: { children: React.ReactNode }) {
    const [fontSize, setFontSizeState] = useState<FontSize>(() =>
        readStoredOption("reading-font-size", "normal", ["normal", "large"])
    )
    const [lineWidth, setLineWidthState] = useState<LineWidth>(() =>
        readStoredOption("reading-line-width", "normal", ["normal", "wide"])
    )
    const [isFocusMode, setIsFocusMode] = useState(false)

    const setFontSize = (size: FontSize) => {
        setFontSizeState(size)
        localStorage.setItem("reading-font-size", size)
    }

    const setLineWidth = (width: LineWidth) => {
        setLineWidthState(width)
        localStorage.setItem("reading-line-width", width)
    }

    const toggleFocusMode = () => setIsFocusMode((current) => !current)

    return (
        <ReadingContext.Provider
            value={{
                fontSize,
                setFontSize,
                lineWidth,
                setLineWidth,
                isFocusMode,
                toggleFocusMode,
            }}
        >
            {children}
        </ReadingContext.Provider>
    )
}

export function useReading() {
    const context = useContext(ReadingContext)
    if (context === undefined) {
        throw new Error("useReading must be used within a ReadingProvider")
    }
    return context
}
