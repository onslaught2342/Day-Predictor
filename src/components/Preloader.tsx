import { useEffect, useState, useMemo } from "react";
const loadingImages: { [key: string]: string } = {
    "🔮 Consulting ancient astrologers...": "https://media.giphy.com/media/3o7TKTDn976rzVgky4/giphy.gif",
    "🤖 Deploying AI neural networks...": "https://media.giphy.com/media/LmNwrBhejkK9EFP504/giphy.gif",
    "⚛️ Using quantum computing algorithms...": "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",
    "🔗 Scanning via blockchain technology...": "https://media.giphy.com/media/l0HlQXlQ3nHyLMvte/giphy.gif",
    "🛸 Contacting NASA satellites...": "https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif",
    "🧠 Analyzing with machine learning...": "https://media.giphy.com/media/l4FGpP4lxGGgK5CBW/giphy.gif",
    "🌌 Accessing space-time continuum...": "https://media.giphy.com/media/3oKIPwoeGErMmaI43S/giphy.gif",
    "💎 Decrypting cosmic algorithms...": "https://media.giphy.com/media/DHqth0hVQoIzS/giphy.gif",
    "🔬 Running DNA sequence analysis...": "https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif",
    "🎯 Applying deep learning models...": "https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/giphy.gif",
    "🌊 Surfing through data ocean...": "https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif",
    "⚡ Charging flux capacitor...": "https://media.giphy.com/media/gHEfa33VkKAjm/giphy.gif",
    "🎪 Performing complex calculations...": "https://media.giphy.com/media/BmmfETghGOPrW/giphy.gif",
    "🔐 Breaking encryption codes...": "https://media.giphy.com/media/26tn8zNgXYhAWWJKo/giphy.gif",
    "🌟 Consulting Elon Musk's AI...": "https://media.giphy.com/media/WT8vMFXcT8YLK/giphy.gif",
    "📡 Establishing satellite connection...": "https://media.giphy.com/media/l3vRfNA1p0rvhMSvS/giphy.gif",
    "🧬 Sequencing temporal DNA...": "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif",
    "🎨 Rendering 4D visualizations...": "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif"
};

interface Props {
    onDone: () => void;
}

interface PreloadFileInfo {
    url: string;
    size: number;
    type: string;
    mode?: string;
}

const CACHE_NAME = "preloader-cache-v2";

const Preloader = ({ onDone }: Props) => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const isLowEnd = navigator.hardwareConcurrency <= 2;

    const preloadUrls = useMemo(() => {
        return isMobile || isLowEnd
            ? [
                "https://media.giphy.com/media/3o7TKTDn976rzVgky4/giphy.gif",
                "https://media.giphy.com/media/LmNwrBhejkK9EFP504/giphy.gif",
                "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",
                "https://media.giphy.com/media/l0HlQXlQ3nHyLMvte/giphy.gif",
                "https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif",
                "https://media.giphy.com/media/l4FGpP4lxGGgK5CBW/giphy.gif",
                "https://media.giphy.com/media/3oKIPwoeGErMmaI43S/giphy.gif",
                "https://media.giphy.com/media/DHqth0hVQoIzS/giphy.gif",
                "https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif",
                "https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/giphy.gif",
                "https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif",
                "https://media.giphy.com/media/gHEfa33VkKAjm/giphy.gif",
                "https://media.giphy.com/media/BmmfETghGOPrW/giphy.gif",
                "https://media.giphy.com/media/26tn8zNgXYhAWWJKo/giphy.gif",
                "https://media.giphy.com/media/WT8vMFXcT8YLK/giphy.gif",
                "https://media.giphy.com/media/l3vRfNA1p0rvhMSvS/giphy.gif",
                "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif",
                "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",

            ]
            : [
                "https://media.giphy.com/media/3o7TKTDn976rzVgky4/giphy.gif",
                "https://media.giphy.com/media/LmNwrBhejkK9EFP504/giphy.gif",
                "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",
                "https://media.giphy.com/media/l0HlQXlQ3nHyLMvte/giphy.gif",
                "https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif",
                "https://media.giphy.com/media/l4FGpP4lxGGgK5CBW/giphy.gif",
                "https://media.giphy.com/media/3oKIPwoeGErMmaI43S/giphy.gif",
                "https://media.giphy.com/media/DHqth0hVQoIzS/giphy.gif",
                "https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif",
                "https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/giphy.gif",
                "https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif",
                "https://media.giphy.com/media/gHEfa33VkKAjm/giphy.gif",
                "https://media.giphy.com/media/BmmfETghGOPrW/giphy.gif",
                "https://media.giphy.com/media/26tn8zNgXYhAWWJKo/giphy.gif",
                "https://media.giphy.com/media/WT8vMFXcT8YLK/giphy.gif",
                "https://media.giphy.com/media/l3vRfNA1p0rvhMSvS/giphy.gif",
                "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif",
                "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",
            ];
    }, [isMobile, isLowEnd]);

    const [loadedBytes, setLoadedBytes] = useState(0);
    const [totalBytes, setTotalBytes] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [eta, setEta] = useState<number | null>(null);

    const [loadedFilesSet, setLoadedFilesSet] = useState<Set<string>>(new Set());

    const cacheFile = async (url: string) => {
        const cache = await caches.open(CACHE_NAME);
        const match = await cache.match(url);
        if (!match) {
            const res = await fetch(url, { cache: "no-store" });
            await cache.put(url, res.clone());
            return res;
        }
        return match;
    };

    const markLoadedFile = (url: string) => {
        setLoadedFilesSet((prev) => {
            if (!prev.has(url)) {
                const next = new Set(prev);
                next.add(url);
                return next;
            }
            return prev;
        });
    };

    useEffect(() => {
        let cancelled = false;

        if (preloadUrls.some((u) => u.includes("?bypass-cache=1"))) {
            caches.delete(CACHE_NAME);
        }

        const preloadDesktop = async () => {
            const cache = await caches.open(CACHE_NAME);

            // Fetch preloader info from JSON instead of HEAD requests
            const fileInfoMap: Map<string, PreloadFileInfo> = new Map();
            try {
                const infoRes = await fetch("/preloader-info.json");
                const fileInfos: PreloadFileInfo[] = await infoRes.json();
                const mode = isMobile || isLowEnd ? "mobile" : "desktop";
                fileInfos
                    .filter((f) => !f.mode || f.mode === mode)
                    .forEach((f) => fileInfoMap.set(f.url, f));
            } catch (err) {
                console.warn("Failed to load preloader-info.json, falling back to HEAD requests");
            }

            let total = 0;
            for (const url of preloadUrls) {
                const info = fileInfoMap.get(url);
                total += info?.size || 0;
            }
            setTotalBytes(total);

            let downloaded = 0;
            let lastTime = performance.now();
            let lastBytes = 0;

            for (const url of preloadUrls) {
                const res = await cacheFile(url);
                const reader = res.body?.getReader();
                if (reader) {
                    let buffer = 0;
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        if (cancelled) return;

                        downloaded += value?.length || 0;
                        buffer += value?.length || 0;

                        if (buffer > 10_000) {
                            setLoadedBytes(downloaded);
                            buffer = 0;
                        }

                        const now = performance.now();
                        const diff = (now - lastTime) / 1000;
                        if (diff > 0.2) {
                            const bytesDiff = downloaded - lastBytes;
                            const currentSpeed = bytesDiff / diff;
                            setSpeed(currentSpeed);
                            const remaining = total - downloaded;
                            setEta(currentSpeed > 0 ? remaining / currentSpeed : null);
                            lastBytes = downloaded;
                            lastTime = now;
                        }
                    }
                    setLoadedBytes(downloaded);
                }
            }

            if (!cancelled) onDone();
        };

        const preloadMobile = async () => {
            await Promise.all(
                preloadUrls.map(async (url) => {
                    await cacheFile(url);
                    markLoadedFile(url);
                })
            );
            if (!cancelled) onDone();
        };

        if (isMobile || isLowEnd) preloadMobile();
        else preloadDesktop();

        return () => {
            cancelled = true;
        };
    }, [onDone, isMobile, isLowEnd, preloadUrls]);

    const pct =
        isMobile || isLowEnd
            ? Math.min(100, (loadedFilesSet.size / preloadUrls.length) * 100)
            : totalBytes
                ? (loadedBytes / totalBytes) * 100
                : 0;

    const mb = (b: number) => (b / (1024 * 1024)).toFixed(2);

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url('./jinwoo.png')` }}
        >

            <div className="w-11/12 max-w-md h-8 rounded-full bg-white/10 backdrop-blur-md shadow-lg overflow-hidden">
                <div
                    className="h-full bg-pink-500 transition-all duration-300 ease-out animate-pulse"
                    style={{ width: `${pct}%` }}
                />
            </div>

            <div className="mt-4 sm:mt-6 text-base sm:text-lg text-white text-center space-y-1 sm:space-y-2 font-mono drop-shadow-lg">
                <p>{pct.toFixed(1)}%</p>
                {isMobile || isLowEnd ? (
                    <p>
                        {loadedFilesSet.size} / {preloadUrls.length} files
                    </p>
                ) : (
                    <>
                        <p>
                            {mb(loadedBytes)} / {mb(totalBytes)} MB
                        </p>
                        <p>{(speed / (1024 * 1024)).toFixed(2)} MB/s</p>
                        <p>ETA: {eta ? eta.toFixed(1) : "--"}s</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Preloader;
