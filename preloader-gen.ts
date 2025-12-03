import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.dirname(__filename);

const OUTPUT_FILE = path.join(ROOT, "public/preloader-info.json");

const LOCAL_FILES = {
	mobile: [
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
		"/gif/gTviM5HfTDKapOJ8L.gif",
		"/gif/Zy7lVxTwoFE4BJoNUQ.gif",
		"/gif/3o7TKSjRrfIPjeiVyM.gif",
		"/gif/uSzTwQTqBWOuSmgDS9.gif",
		"/gif/6Ar6K19y0GqOezYJRj.gif",
		"/gif/Uh1ZPq7mA7xa8.gif",
		"/gif/FWAcpJsFT9mvrv0e7a.gif",
	],
	desktop: [
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
		"/gif/gTviM5HfTDKapOJ8L.gif",
		"/gif/Zy7lVxTwoFE4BJoNUQ.gif",
		"/gif/3o7TKSjRrfIPjeiVyM.gif",
		"/gif/uSzTwQTqBWOuSmgDS9.gif",
		"/gif/6Ar6K19y0GqOezYJRj.gif",
		"/gif/Uh1ZPq7mA7xa8.gif",
		"/gif/FWAcpJsFT9mvrv0e7a.gif",
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
