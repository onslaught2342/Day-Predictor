import { useEffect, useState, useMemo } from "react";

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

    // Only preload critical assets for faster initial load
    const preloadUrls = useMemo(() => {
        // Preload only first 6 GIFs for better performance
        return [
            "/gif/3o7TKTDn976rzVgky4.gif",
            "/gif/LmNwrBhejkK9EFP504.gif",
            "/gif/xT9IgzoKnwFNmISR8I.gif",
            "/gif/9FQ89bO3TipLASwmRs.gif",
            "/gif/l0HlQXlQ3nHyLMvte.gif",
            "/gif/l4FGpP4lxGGgK5CBW.gif",
            "/gif/3oKIPwoeGErMmaI43S.gif",
            "/gif/DHqth0hVQoIzS.gif",
            "/gif/3oKIPEqDGUULpEU0aQ.gif",
            "/gif/l0HlHFRbmaZtBRhXG.gif",
            "/gif/26tn33aiTi1jkl6H6.gif",
            "/gif/3o7qE4opCd6f1NJeuY.gif",
            "/gif/BmmfETghGOPrW.gif",
            "/gif/077i6AULCXc0FKTj9s.gif",
            "/gif/gTviM5HfTDKapOJ8eL.gif",
            "/gif/Zy7lVxTwoFE4BJoNUQ.gif",
            "/gif/3o7TKSjRrfIPjeiVyM.gif",
            "/gif/uSzTwQTqBWOuSmgDS9.gif",
            "/gif/6Ar6K19y0GqOezYJRj.gif",
            "/gif/Uh1ZPq7mA7xa8.gif",
            "/gif/FWAcpJsFT9mvrv0e7a.gif",
        ];
    }, []);

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
        let completed = false;

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

            // Ensure we have a minimum total to avoid division by zero
            if (total === 0) total = preloadUrls.length * 100000; // Fallback estimate
            setTotalBytes(total);

            let downloaded = 0;
            let lastTime = performance.now();
            let lastBytes = 0;

            for (const url of preloadUrls) {
                if (cancelled) return;

                try {
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
                            if (diff >= 0.5) {
                                const s = (downloaded - lastBytes) / diff;
                                setSpeed(s);
                                setEta((total - downloaded) / s);
                                lastTime = now;
                                lastBytes = downloaded;
                            }
                        }
                    }
                    markLoadedFile(url);
                } catch (err) {
                    console.error(`Failed to preload ${url}:`, err);
                    // Continue with other files even if one fails
                }
            }

            if (!cancelled && !completed) {
                completed = true;
                onDone();
            }
        };

        const preloadMobile = async () => {
            try {
                await Promise.all(
                    preloadUrls.map(async (url) => {
                        if (cancelled) return;
                        try {
                            await cacheFile(url);
                            markLoadedFile(url);
                        } catch (err) {
                            console.error(`Failed to preload ${url}:`, err);
                        }
                    })
                );
                if (!cancelled && !completed) {
                    completed = true;
                    onDone();
                }
            } catch (err) {
                console.error('Preload error:', err);
                if (!cancelled && !completed) {
                    completed = true;
                    onDone();
                }
            }
        };

        if (isMobile || isLowEnd) preloadMobile();
        else preloadDesktop();

        return () => {
            cancelled = true;
        };
    }, [isMobile, isLowEnd]);

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
            style={{
                backgroundImage: `url('./jinwoo.png')`,
                imageRendering: 'crisp-edges'
            }}
        >

            <div className="w-11/12 max-w-md h-8 rounded-full bg-white/10 backdrop-blur-md shadow-lg overflow-hidden">
                <div
                    className="h-full bg-pink-500 transition-all duration-300 ease-out"
                    style={{
                        width: `${pct}%`,
                        willChange: 'width'
                    }}
                />
            </div>

            <div className="mt-4 sm:mt-6 text-base sm:text-lg text-white text-center space-y-1 sm:space-y-2 font-mono drop-shadow-lg">
                <p className="font-bold text-2xl">{pct.toFixed(1)}%</p>
                {isMobile || isLowEnd ? (
                    <p className="text-sm opacity-80">
                        {loadedFilesSet.size} / {preloadUrls.length} assets loaded
                    </p>
                ) : (
                    <>
                        <p className="text-sm opacity-80">
                            {mb(loadedBytes)} / {mb(totalBytes)} MB
                        </p>
                        {speed > 0 && (
                            <>
                                <p className="text-xs opacity-70">{(speed / (1024 * 1024)).toFixed(2)} MB/s</p>
                                {eta && eta > 0 && <p className="text-xs opacity-70">ETA: {eta.toFixed(1)}s</p>}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Preloader;
