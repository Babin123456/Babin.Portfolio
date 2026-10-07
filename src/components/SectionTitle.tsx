import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAnimate } from "framer-motion";
import {
    CharBox,
    ROTATION_MAP,
    DEFAULT_TRANSITION,
} from "@/components/ui/text-3d-flip";

interface ColorSegment {
    text: string;
    className: string;
}

interface SectionTitleProps {
    text?: string;
    segments?: ColorSegment[];
    className?: string;
    rotateDirection?: "top" | "right" | "bottom" | "left";
    staggerDuration?: number;
    showUnderline?: boolean;
    underlineClassName?: string;
}

const SectionTitle = ({
    text,
    segments,
    className = "",
    rotateDirection = "right",
    staggerDuration = 0.035,
    showUnderline = true,
    underlineClassName = "",
}: SectionTitleProps) => {
    const [scope, animate] = useAnimate();
    const [isAnimating, setIsAnimating] = useState(true);
    const isHoverAnimatingRef = useRef(false);
    const isMountedRef = useRef(false);

    const rotationTransform = ROTATION_MAP[rotateDirection];

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            isHoverAnimatingRef.current = false;
        };
    }, []);

    // Build character list with their respective classes
    const buildCharacterList = useCallback(() => {
        if (segments && segments.length > 0) {
            const chars: Array<{ char: string; className: string; index: number }> = [];
            let charIndex = 0;
            segments.forEach((segment) => {
                segment.text.split("").forEach((char) => {
                    chars.push({
                        char,
                        className: segment.className,
                        index: charIndex++,
                    });
                });
            });
            return chars;
        } else if (text) {
            return text.split("").map((char, index) => ({
                char,
                className,
                index,
            }));
        }
        return [];
    }, [segments, text, className]);

    const charList = useMemo(() => buildCharacterList(), [buildCharacterList]);

    // Group characters into words to prevent breaking words and enable clean wrapping
    const words = useMemo(() => {
        const wordList: Array<typeof charList> = [];
        let currentWord: typeof charList = [];
        charList.forEach((charObj) => {
            if (charObj.char.trim() === "") {
                if (currentWord.length > 0) {
                    wordList.push(currentWord);
                    currentWord = [];
                }
            } else {
                currentWord.push(charObj);
            }
        });
        if (currentWord.length > 0) {
            wordList.push(currentWord);
        }
        return wordList;
    }, [charList]);

    // Total visible non-space characters that render .text-3d-flip-char
    const totalVisibleChars = useMemo(() => {
        return words.reduce((acc, word) => acc + word.length, 0);
    }, [words]);

    const handleHoverStart = useCallback(async () => {
        if (isHoverAnimatingRef.current || totalVisibleChars === 0) return;
        isHoverAnimatingRef.current = true;

        try {
            const delays = Array.from(
                { length: totalVisibleChars },
                (_, i) => i * staggerDuration
            );

            await animate(
                ".text-3d-flip-char",
                { transform: rotationTransform },
                {
                    ...DEFAULT_TRANSITION,
                    delay: (i: number) => delays[i],
                }
            );

            if (!isMountedRef.current) return;

            await animate(
                ".text-3d-flip-char",
                { transform: "rotateX(0deg) rotateY(0deg)" },
                { duration: 0 }
            );
        } finally {
            if (isMountedRef.current) {
                isHoverAnimatingRef.current = false;
            }
        }
    }, [totalVisibleChars, staggerDuration, rotationTransform, animate]);

    // Wave entrance animation observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsAnimating(true);
                } else {
                    setIsAnimating(false);
                }
            },
            { threshold: 0.25 }
        );

        if (scope.current) {
            observer.observe(scope.current);
        }

        return () => observer.disconnect();
    }, [scope]);

    return (
        <div
            ref={scope}
            className={`w-full flex flex-col justify-center items-center ${className}`}
        >
            <div className="relative inline-flex flex-col items-center overflow-visible">
                <div
                    onMouseEnter={handleHoverStart}
                    className={`w-fit inline-flex flex-wrap justify-center items-center gap-x-[0.35em] gap-y-1 font-heading font-normal tracking-normal perspective-1000 cursor-default select-none overflow-visible py-2 pb-3 ${className}`}
                >
                    {words.map((wordChars, wordIndex) => (
                        <span key={wordIndex} className="inline-flex whitespace-nowrap cursor-default overflow-visible py-1">
                            {wordChars.map(({ char, className: charClass, index }) => (
                                <span
                                    key={index}
                                    className={`inline-block will-change-transform cursor-default overflow-visible pb-1 ${
                                        isAnimating ? "animate-wave" : "opacity-0 translate-y-6"
                                    } [animation-fill-mode:both] [animation-timing-function:cubic-bezier(0.34,1.56,0.64,1)]`}
                                    data-index={index}
                                >
                                    <CharBox
                                        char={char}
                                        textClassName={charClass}
                                        flipTextClassName={charClass}
                                        rotateDirection={rotateDirection}
                                    />
                                </span>
                            ))}
                        </span>
                    ))}
                </div>

                {showUnderline && (
                    <div
                        className={`w-full max-w-[92%] sm:max-w-[85%] mt-1 sm:mt-2 h-2.5 sm:h-3.5 flex justify-center items-center overflow-visible pointer-events-none transition-all duration-700 ease-out ${
                            isAnimating ? "opacity-100 scale-x-100" : "opacity-0 scale-x-75"
                        } origin-center ${underlineClassName}`}
                        aria-hidden="true"
                    >
                        <svg
                            viewBox="0 0 320 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-full preserve-3d"
                        >
                            <defs>
                                <linearGradient id="paintStrokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" className="[stop-color:#1d4ed8] dark:[stop-color:#89D3BD]" stopOpacity="0.15" />
                                    <stop offset="25%" className="[stop-color:#2563eb] dark:[stop-color:#89D3BD]" stopOpacity="0.85" />
                                    <stop offset="60%" className="[stop-color:#0284c7] dark:[stop-color:#22d3ee]" stopOpacity="0.95" />
                                    <stop offset="85%" className="[stop-color:#1d4ed8] dark:[stop-color:#89D3BD]" stopOpacity="0.8" />
                                    <stop offset="100%" className="[stop-color:#1e40af] dark:[stop-color:#2dd4bf]" stopOpacity="0.1" />
                                </linearGradient>
                                <filter id="paintGlow" x="-10%" y="-30%" width="120%" height="160%">
                                    <feGaussianBlur stdDeviation="1.5" result="glow" />
                                    <feComposite in="SourceGraphic" in2="glow" operator="over" />
                                </filter>
                            </defs>
                            {/* Artistic paint/brush textured underline stroke */}
                            <path
                                d="M3 13 C 45 6, 120 4, 185 8 C 240 11, 285 7, 317 11 C 290 14, 235 15, 175 12 C 110 9, 50 16, 3 13 Z"
                                fill="url(#paintStrokeGrad)"
                                filter="url(#paintGlow)"
                            />
                            {/* Secondary delicate dynamic brush flick */}
                            <path
                                d="M22 14.5 C 75 10.5, 160 8.5, 245 12.5 C 275 13.5, 298 12, 308 13.5"
                                stroke="url(#paintStrokeGrad)"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                opacity="0.6"
                            />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SectionTitle;
