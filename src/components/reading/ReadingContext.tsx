"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

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

export function ReadingProvider({ children }: { children: React.ReactNode }) {
    const [fontSize, setFontSizeState] = useState<FontSize>("normal")
    const [lineWidth, setLineWidthState] = useState<LineWidth>("normal")
    const [isFocusMode, setIsFocusMode] = useState(false)

    // Load from localStorage on mount
    useEffect(() => {
        const savedFontSize = localStorage.getItem("reading-font-size") as FontSize
        const savedLineWidth = localStorage.getItem("reading-line-width") as LineWidth
        if (savedFontSize) setFontSizeState(savedFontSize)
        if (savedLineWidth) setLineWidthState(savedLineWidth)
    }, [])

    const setFontSize = (size: FontSize) => {
        setFontSizeState(size)
        localStorage.setItem("reading-font-size", size)
    }

    const setLineWidth = (width: LineWidth) => {
        setLineWidthState(width)
        localStorage.setItem("reading-line-width", width)
    }

    const toggleFocusMode = () => setIsFocusMode(!isFocusMode)

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
