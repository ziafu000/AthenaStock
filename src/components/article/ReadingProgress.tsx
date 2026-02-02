"use client"

import { useEffect, useState } from "react"

export function ReadingProgress() {
    const [completion, setCompletion] = useState(0)

    useEffect(() => {
        const updateScrollCompletion = () => {
            const currentProgress = window.scrollY
            const scrollHeight = document.body.scrollHeight - window.innerHeight
            if (scrollHeight) {
                setCompletion(
                    Number((currentProgress / scrollHeight).toFixed(2)) * 100
                )
            }
        }

        window.addEventListener("scroll", updateScrollCompletion)

        return () => {
            window.removeEventListener("scroll", updateScrollCompletion)
        }
    }, [])

    return (
        <div className="fixed top-0 left-0 z-[60] h-1 w-full bg-transparent print:hidden pointer-events-none">
            <div
                className="h-full bg-accent transition-all duration-150 ease-out shadow-[0_0_10px_rgba(var(--accent),0.5)]"
                style={{ width: `${completion}%` }}
            />
        </div>
    )
}
