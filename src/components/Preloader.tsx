import { useEffect, useState } from "react";

interface Props {
    onDone: () => void;
}

interface PreloadFileInfo {
    url: string;
    size: number;
    type: string;
    mode?: string;
}

const CACHE_NAME = "preloader-cache-json";

const Preloader = ({ onDone }: Props) => {
    const [files, setFiles] = useState<PreloadFileInfo[]>([]);
    const [loadedBytes, setLoadedBytes] = useState(0);
    const [loadedFiles, setLoadedFiles] = useState<Set<string>>(new Set());
    const [totalBytes, setTotalBytes] = useState(0);

    useEffect(() => {
        let cancelled = false;

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

        const preload = async () => {
            try {
                // Fetch the JSON
                const res = await fetch("/preloader-info.json");
                const data: PreloadFileInfo[] = await res.json();
                if (cancelled) return;

                // Filter based on mode (mobile/desktop)
                const isMobile = window.matchMedia("(max-width: 768px)").matches;
                const isLowEnd = navigator.hardwareConcurrency <= 2;
                const mode = isMobile || isLowEnd ? "mobile" : "desktop";
                const filtered = data.filter(f => !f.mode || f.mode === mode);

                setFiles(filtered);

                // Calculate total bytes
                const total = filtered.reduce((acc, f) => acc + f.size, 0);
                setTotalBytes(total);

                for (const file of filtered) {
                    if (cancelled) return;

                    try {
                        const res = await cacheFile(file.url);
                        const blob = await res.blob();
                        setLoadedBytes(prev => prev + blob.size);
                        setLoadedFiles(prev => new Set(prev).add(file.url));
                    } catch (err) {
                        console.error(`Failed to preload ${file.url}:`, err);
                    }
                }

                if (!cancelled) onDone();
            } catch (err) {
                console.error("Failed to fetch preloader JSON:", err);
            }
        };

        preload();

        return () => { cancelled = true; };
    }, [onDone]);

    const pct = totalBytes ? (loadedBytes / totalBytes) * 100 : 0;
    const mb = (b: number) => (b / (1024 * 1024)).toFixed(2);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url('./jinwoo.png')` }}>
            <div className="w-11/12 max-w-md h-8 rounded-full bg-white/10 backdrop-blur-md shadow-lg overflow-hidden">
                <div className="h-full bg-pink-500 transition-all duration-300 ease-out" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-4 sm:mt-6 text-base sm:text-lg text-white text-center font-mono drop-shadow-lg">
                <p className="font-bold text-2xl">{pct.toFixed(1)}%</p>
                <p className="text-sm opacity-80">{loadedFiles.size} / {files.length} assets loaded</p>
                <p className="text-sm opacity-80">{mb(loadedBytes)} / {mb(totalBytes)} MB</p>
            </div>
        </div>
    );
};

export default Preloader;
