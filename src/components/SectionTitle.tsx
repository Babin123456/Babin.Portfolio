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
}

const SectionTitle = ({
    text,
    segments,
    className = "",
    rotateDirection = "right",
    staggerDuration = 0.035,
}: SectionTitleProps) => {
    const [scope, animate] = useAnimate();
    const [isAnimating, setIsAnimating] = useState(false);
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
            className={`w-full flex justify-center items-center ${className}`}
        >
            <div
                onMouseEnter={handleHoverStart}
                className="w-fit inline-flex flex-wrap justify-center items-center gap-x-[0.35em] gap-y-1 font-heading font-normal tracking-normal perspective-1000 cursor-default select-none"
            >
                {words.map((wordChars, wordIndex) => (
                    <span key={wordIndex} className="inline-flex whitespace-nowrap cursor-default">
                        {wordChars.map(({ char, className: charClass, index }) => (
                            <span
                                key={index}
                                className={`inline-block will-change-transform cursor-default ${charClass} ${isAnimating ? "animate-wave" : "opacity-0 translate-y-6"
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
        </div>
    );
};

export default SectionTitle;
