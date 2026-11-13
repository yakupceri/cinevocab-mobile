/* CineVocab mobil: bir YouTube videosunun altyazisindan [kelime, adet] listesi cikarir.
   Mantik eklentideki yt-import.js ile ayni; fark: burada sayfa disaridan (Capacitor'un yerel HTTP'si ile) cekilir.
   Sunucuya altyazi metni gitmez, yalnizca kelime listesi gider. lang.js (CVL) bu dosyadan once yuklenir. */
(function (root) {
  "use strict";
  const MAX_OUT = 6000;

  // Linkin icinden video kimligini bulur; bulamazsa bos doner.
  function videoId(url) {
    const m = /(?:[?&]v=|youtu\.be\/|\/shorts\/|\/embed\/|\/live\/)([\w-]{6,15})/.exec(String(url || ""));
    return m ? m[1] : "";
  }

  async function get(url, init) {
    const r = await fetch(url, init);
    if (!r.ok) throw new Error("HTTP " + r.status);
    return await r.text();
  }

  // Sayfa kaynagindaki "captionTracks":[...] dizisini bulur. Dizge icindeki koseli parantezler sayilmaz.
  function grabArray(html, key) {
    const i = html.indexOf(key);
    if (i < 0) return null;
    const s = html.indexOf("[", i);
    if (s < 0) return null;
    let depth = 0, inStr = false, esc = false;
    for (let j = s; j < html.length; j++) {
      const c = html[j];
      if (inStr) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === '"') inStr = false; continue; }
      if (c === '"') inStr = true;
      else if (c === "[") depth++;
      else if (c === "]" && --depth === 0) return html.slice(s, j + 1);
    }
    return null;
  }

  function decodeEntities(s) {
    return s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  }

  // 1. yol: izleme sayfasinin kaynagi (basligi da buradan aliriz).
  async function fromWatchPage(id) {
    const html = await get("https://www.youtube.com/watch?v=" + id + "&hl=en");
    let title = "";
    const m = /<meta name="title" content="([^"]*)"/.exec(html) || /<title>([^<]*)<\/title>/.exec(html);
    if (m) title = decodeEntities(m[1]).replace(/\s*-\s*YouTube\s*$/i, "").trim();
    const arr = grabArray(html, '"captionTracks":');
    let tracks = [];
    if (arr) { try { tracks = JSON.parse(arr); } catch (e) {} }
    return { title: title, tracks: tracks };
  }

  // 2. yol (yedek): YouTube'un oynatici servisi. Izleme sayfasi altyazi vermezse denenir.
  async function fromPlayerApi(id) {
    const txt = await get("https://www.youtube.com/youtubei/v1/player?prettyPrint=false", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId: id, context: { client: { clientName: "ANDROID", clientVersion: "20.10.38", androidSdkVersion: 34, hl: "en" } } }),
    });
    const j = JSON.parse(txt);
    const list = j && j.captions && j.captions.playerCaptionsTracklistRenderer;
    return { title: (j && j.videoDetails && j.videoDetails.title) || "", tracks: (list && list.captionTracks) || [] };
  }

  const langOf = (t) => String(t.languageCode || "").toLowerCase().split("-")[0];

  // Istenen dildeki altyaziyi sec: elle yazilmis varsa o, yoksa otomatik.
  function pickTrack(tracks, src) {
    const mine = tracks.filter((t) => langOf(t) === src);
    return mine.find((t) => t.kind !== "asr") || mine[0] || null;
  }

  // Altyazi satirlarini indirir. Once JSON bicimi istenir; gelmezse XML bicimi ayristirilir.
  async function captionLines(track) {
    const u = new URL(track.baseUrl, "https://www.youtube.com");
    if (!/(^|\.)youtube\.com$/.test(u.hostname)) throw new Error("host");
    u.searchParams.set("fmt", "json3");
    const out = [];
    let body = await get(u.href);
    try {
      const j = JSON.parse(body);
      for (const ev of j.events || []) {
        if (!ev.segs) continue;
        const line = ev.segs.map((s) => s.utf8 || "").join("").replace(/\s+/g, " ").trim();
        if (line) out.push(line);
      }
      return out;
    } catch (e) {}
    if (!body.trim()) { u.searchParams.delete("fmt"); body = await get(u.href); }
    const doc = new DOMParser().parseFromString(body, "text/xml");
    for (const n of doc.querySelectorAll("text, p")) {
      const line = decodeEntities(n.textContent || "").replace(/\s+/g, " ").trim();
      if (line) out.push(line);
    }
    return out;
  }

  const lower = (s, src) => (src === "tr" ? s.replace(/İ/g, "i").replace(/I/g, "ı") : s).toLowerCase();

  // Satirlardan [kelime, adet] cikarir. Ozel isimler (cumle ortasinda hep buyuk harfle) ve yaygin kelimeler atilir.
  function tokenize(lines, src) {
    let seg;
    try { seg = new Intl.Segmenter(src, { granularity: "word" }); } catch (e) { seg = new Intl.Segmenter("en", { granularity: "word" }); }
    const minLen = { ja: 1, ko: 1, hi: 2, ar: 2, ru: 3 }[src] || 3;
    const count = new Map(), lowSeen = new Set(), midCap = new Set();
    for (const raw of lines) {
      const line = raw.replace(/[’‘`]/g, "'");
      let first = true;
      for (const part of seg.segment(line)) {
        if (!part.isWordLike) continue;
        const segment = part.segment, w = lower(segment, src);
        const wasFirst = first; first = false;
        if (w.length < minLen || /[\d０-９]/.test(w)) continue;
        if (segment !== w) { if (!wasFirst && src !== "de" && segment[0] === segment[0].toUpperCase()) midCap.add(w); }
        else lowSeen.add(w);
        count.set(w, (count.get(w) || 0) + 1);
      }
    }
    const CVL = root.CVL;
    for (const w of Array.from(count.keys())) {
      if ((CVL && CVL.isStop(w, src)) || (midCap.has(w) && !lowSeen.has(w))) count.delete(w);
    }
    let list = Array.from(count.entries()).sort((a, b) => b[1] - a[1]);
    // Yaygin kelime listesi olmayan dillerde en sik gecen 25 kelime cogunlukla ek/edat: at
    if (!CVL || !CVL.hasStop(src)) list = list.slice(25);
    return list.slice(0, MAX_OUT);
  }

  /* Sonuc: { ok:true, title, thumb, auto, lines, words:[[kelime, adet]] }
     ya da  { ok:false, err:"novideo"|"notracks"|"lang"|"empty"|"fail", have:[diller] } */
  async function readTranscript(url, src) {
    const id = videoId(url);
    if (!id) return { ok: false, err: "novideo" };
    let title = "", sawTracks = false, have = null, failed = 0;
    const sources = [fromWatchPage, fromPlayerApi];
    for (const source of sources) {
      try {
        const r = await source(id);
        title = title || r.title;
        if (!r.tracks.length) continue;
        sawTracks = true;
        const track = pickTrack(r.tracks, src);
        if (!track) { have = Array.from(new Set(r.tracks.map(langOf))).slice(0, 6); continue; }
        const lines = await captionLines(track);
        if (!lines.length) continue;
        return { ok: true, id: id, title: (title || "YouTube · " + id).slice(0, 80), thumb: "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg",
                 auto: track.kind === "asr", lines: lines.length, words: tokenize(lines, src) };
      } catch (e) { failed++; }
    }
    if (have) return { ok: false, err: "lang", have: have };
    if (sawTracks) return { ok: false, err: "empty" };
    return { ok: false, err: failed === sources.length ? "fail" : "notracks" };
  }

  root.CVYT = { videoId: videoId, readTranscript: readTranscript, tokenize: tokenize };
})(typeof window !== "undefined" ? window : globalThis);
