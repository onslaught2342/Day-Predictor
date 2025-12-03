import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.dirname(__filename);

const OUTPUT_FILE = path.join(ROOT, "public/preloader-info.json");

const LOCAL_FILES = {
	mobile: [
		"/gif/3o7TKTDn976rzVgky4.webm",
		"/gif/LmNwrBhejkK9EFP504.webm",
		"/gif/xT9IgzoKnwFNmISR8I.webm",
		"/gif/9FQ89bO3TipLASwmRs.webm",
		"/gif/l0HlQXlQ3nHyLMvte.webm",
		"/gif/l4FGpP4lxGGgK5CBW.webm",
		"/gif/3oKIPwoeGErMmaI43S.webm",
		"/gif/DHqth0hVQoIzS.webm",
		"/gif/3oKIPEqDGUULpEU0aQ.webm",
		"/gif/l0HlHFRbmaZtBRhXG.webm",
		"/gif/26tn33aiTi1jkl6H6.webm",
		"/gif/3o7qE4opCd6f1NJeuY.webm",
		"/gif/BmmfETghGOPrW.webm",
		"/gif/077i6AULCXc0FKTj9s.webm",
		"/gif/gTviM5HfTDKapOJ8eL.webm",
		"/gif/Zy7lVxTwoFE4BJoNUQ.webm",
		"/gif/3o7TKSjRrfIPjeiVyM.webm",
		"/gif/uSzTwQTqBWOuSmgDS9.webm",
		"/gif/6Ar6K19y0GqOezYJRj.webm",
		"/gif/Uh1ZPq7mA7xa8.webm",
		"/gif/FWAcpJsFT9mvrv0e7a.webm",
	],
	desktop: [
		"/gif/3o7TKTDn976rzVgky4.webm",
		"/gif/LmNwrBhejkK9EFP504.webm",
		"/gif/xT9IgzoKnwFNmISR8I.webm",
		"/gif/9FQ89bO3TipLASwmRs.webm",
		"/gif/l0HlQXlQ3nHyLMvte.webm",
		"/gif/l4FGpP4lxGGgK5CBW.webm",
		"/gif/3oKIPwoeGErMmaI43S.webm",
		"/gif/DHqth0hVQoIzS.webm",
		"/gif/3oKIPEqDGUULpEU0aQ.webm",
		"/gif/l0HlHFRbmaZtBRhXG.webm",
		"/gif/26tn33aiTi1jkl6H6.webm",
		"/gif/3o7qE4opCd6f1NJeuY.webm",
		"/gif/BmmfETghGOPrW.webm",
		"/gif/077i6AULCXc0FKTj9s.webm",
		"/gif/gTviM5HfTDKapOJ8eL.webm",
		"/gif/Zy7lVxTwoFE4BJoNUQ.webm",
		"/gif/3o7TKSjRrfIPjeiVyM.webm",
		"/gif/uSzTwQTqBWOuSmgDS9.webm",
		"/gif/6Ar6K19y0GqOezYJRj.webm",
		"/gif/Uh1ZPq7mA7xa8.webm",
		"/gif/FWAcpJsFT9mvrv0e7a.webm",
	],
};

const REMOTE_LINKS = {
	desktop: [],
	mobile: [],
};

function getTypeByExt(ext: string) {
	if (ext.match(/\.(png|jpeg|jpg|gif)$/)) return "image";
	if (ext.match(/\.(mp3|wav|ogg)$/)) return "audio";
	if (ext.match(/\.(mp4|webm)$/)) return "video";
	if (ext.match(/\.(glb|gltf)$/)) return "model";
	return "other";
}

async function fetchRemoteInfo(url: string) {
	try {
		const res = await fetch(url, { method: "HEAD" });
		const size = Number(res.headers.get("Content-Length")) || 0;
		return { url, size, type: "remote" };
	} catch {
		return { url, size: 0, type: "remote" };
	}
}

async function generatePreloaderInfo() {
	const allData: Record<string, any>[] = [];

	for (const mode of ["mobile", "desktop"] as const) {
		const files = LOCAL_FILES[mode];
		for (const url of files) {
			const fullPath = path.join(ROOT, "public", url.replace(/^\.\//, ""));
			if (!fs.existsSync(fullPath)) {
				console.warn(`File not found: ${url}`);
				continue;
			}
			const size = fs.statSync(fullPath).size;
			const ext = path.extname(fullPath).toLowerCase();
			allData.push({ url, size, type: getTypeByExt(ext), mode });
		}

		const remoteLinks = REMOTE_LINKS[mode];
		for (const url of remoteLinks) {
			const info = await fetchRemoteInfo(url);
			allData.push({ ...info, mode });
		}
	}

	fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allData, null, 2));
	console.log(`Preloader info generated at ${OUTPUT_FILE}`);
}

generatePreloaderInfo();
