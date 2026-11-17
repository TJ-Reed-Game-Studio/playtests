// TJ's minutes of play on a playtest page, for the studio's time tracking (the studio's data/README.md,
// Time tracking, The playtest page). tools/ci/deploy_playtest.sh copies this file next to a Web
// build's index.html and loads it there with data-game (the repo name, the game's studio slug) and
// data-commit (the build's commit). It does nothing unless the page was opened with ?by=tj and the
// game's playtest key as ?k=, as the TJs Desk's build links are. Then, each minute the page is visible
// and had a key, click or touch in the last 5 minutes, it posts {game, commit, session, key} to the
// studio-db function's /playtest route, which records that minute once per session when the key is the
// game's. Errors are ignored: the game never waits on it.
(function () {
	"use strict";
	const URL_PLAYTEST = "https://hvlpoumgobcsnmhuepwf.supabase.co/functions/v1/studio-db/playtest";
	const IDLE_MS = 5 * 60 * 1000;
	const script = document.currentScript;
	const query = new URLSearchParams(location.search);
	if (!script || query.get("by") !== "tj") return;
	const key = query.get("k") || "";
	if (!/^[0-9a-f]{32}$/.test(key)) return;
	const game = script.dataset.game || "";
	const commit = script.dataset.commit || "";
	if (!/^[A-Za-z0-9-]{1,64}$/.test(game) || !/^[0-9a-f]{7,40}$/.test(commit)) return;
	const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	const session = Array.from(crypto.getRandomValues(new Uint8Array(20)), (b) => letters[b % letters.length]).join("");
	let lastInput = Date.now();
	for (const kind of ["keydown", "pointerdown", "touchstart", "wheel"]) {
		window.addEventListener(kind, () => { lastInput = Date.now(); }, { capture: true, passive: true });
	}
	setInterval(() => {
		if (document.visibilityState !== "visible" || Date.now() - lastInput > IDLE_MS) return;
		fetch(URL_PLAYTEST, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ game, commit, session, key }),
			keepalive: true,
		}).catch(() => {});
	}, 60 * 1000);
})();
