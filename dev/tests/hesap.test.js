// CineVocab mobil hesaplari: rol esikleri, combo, misafir XP/seviye, gunluk bayraklar, haftalik delgi karti (seri).
// Calistir: node --test dev/tests/
"use strict";
const test = require("node:test"), assert = require("node:assert/strict");
const { yukle } = require("./yukle.js");

test("rol: seviye esikleri 1,3,5,8,12,17,25,40", () => {
  const c = yukle(["RANK_AT", "rankOf"]);
  assert.deepEqual(Array.from(c.RANK_AT), [1, 3, 5, 8, 12, 17, 25, 40]);
  const bekle = { 1: 0, 2: 0, 3: 1, 4: 1, 5: 2, 7: 2, 8: 3, 11: 3, 12: 4, 16: 4, 17: 5, 24: 5, 25: 6, 39: 6, 40: 7, 999: 7 };
  for (const [lv, r] of Object.entries(bekle)) assert.equal(c.rankOf(Number(lv)), r, "seviye " + lv);
});

test("combo: 2'den itibaren gorunur, yanlista sifirlanir, her 5'te ses", () => {
  const sesler = [];
  const c = yukle(["run", "combo"], { sfx: (k) => sesler.push(k), t: (k, n) => n + "x" });
  const node = { hidden: true, textContent: "", style: {}, offsetWidth: 0 };
  c.combo(true, node); assert.equal(node.hidden, true, "1 dogru: gizli");
  c.combo(true, node); assert.equal(node.hidden, false); assert.equal(node.textContent, "2x");
  c.combo(true, node); c.combo(true, node); c.combo(true, node);
  assert.equal(node.textContent, "5x"); assert.deepEqual(sesler, ["combo"]);
  c.combo(false, node); assert.equal(node.hidden, true, "yanlis: gizlenir");
  c.combo(true, node); assert.equal(node.hidden, true, "yanlistan sonra 1'den baslar");
  c.combo(true, null);   // node yokken patlamaz, sayac yine artar
  c.combo(true, node); assert.equal(node.textContent, "3x");
});

function misafir(simdi) {
  const deste = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"].map((w) => ({ tr: w, eng: w + "-en" }));
  return yukle(["dayKey", "demoState", "demoApi"], {
    S: { src: "en", dst: "tr" }, t: (k) => k, CVDEMO: { words: () => deste.slice() }, shuffle: (a) => a,
    askAccount: () => {} }, simdi);
}
const rapor = (c, n, yanlis) => c.demoApi("/api/srs/report", { body: { items:
  Array.from({ length: n }, (_, i) => ({ w: "abcdefghijkl"[i % 12], ok: true })).concat(Array.from({ length: yanlis || 0 }, () => ({ w: "a", ok: false }))) } });

test("misafir XP: dogru basina 10, yanlis 0", () => {
  const c = misafir();
  assert.equal(rapor(c, 3, 2).xp, 30);
  const h = c.demoApi("/api/ext/home", {});
  assert.equal(h.xp, 30); assert.equal(h.xp_today, 30); assert.equal(h.level, 1); assert.equal(h.streak, 1);
});

test("misafir seviye: 200 XP'de bir atlar, xp_into dogru", () => {
  const c = misafir();
  rapor(c, 19); let h = c.demoApi("/api/ext/home", {});
  assert.equal(h.level, 1); assert.equal(h.xp_into, 190);
  rapor(c, 1); h = c.demoApi("/api/ext/home", {});
  assert.equal(h.xp, 200); assert.equal(h.level, 2); assert.equal(h.xp_into, 0); assert.equal(h.xp_level, 200);
  rapor(c, 25); h = c.demoApi("/api/ext/home", {});
  assert.equal(h.level, 3); assert.equal(h.xp_into, 50);
});

test("misafir: gun degisince bugunku XP ve seri sifirlanir, toplam XP kalir", () => {
  const c = misafir("2026-11-24T23:50:00");
  rapor(c, 4);
  c.__saat("2026-11-25T00:10:00");
  const h = c.demoApi("/api/ext/home", {});
  assert.equal(h.xp, 40); assert.equal(h.xp_today, 0); assert.equal(h.streak, 0);
});

test("misafir: 3 kez bilinen kelime kalici sayilir", () => {
  const c = misafir();
  for (let i = 0; i < 3; i++) c.demoApi("/api/srs/report", { body: { items: [{ w: "a", ok: true }, { w: "b", ok: i < 2 }] } });
  assert.equal(c.demoApi("/api/ext/home", {}).mastered, 1);
});

test("gunluk bayraklar: ayni gun kalir, ertesi gun sifirlanir", () => {
  const c = yukle(["dayKey", "flags", "setFlag"], {}, "2026-11-24T21:00:00");
  assert.equal(c.dayKey(), "2026-11-24");
  c.setFlag("goal"); assert.equal(c.flags().goal, true);
  c.__saat("2026-11-25T08:00:00");
  assert.equal(c.flags().goal, undefined); assert.equal(c.flags().d, "2026-11-25");
});

// Delgi karti: sahte DOM ile hangi gunlerin delindigine bakar. 24 Kasim 2026 Sali (hafta Pazartesi baslar, Sali = 1).
function hafta(h, simdi) {
  const kutu = { kids: [], set textContent(v) { this.kids = []; }, appendChild(x) { this.kids.push(x); } }, not = { textContent: "" };
  const c = yukle(["dayKey", "flags", "setFlag", "renderWeek"], {
    S: { ui: "tr" }, t: (k, n) => k + (n === undefined ? "" : ":" + n),
    $: (id) => (id === "week" ? kutu : not),
    el: (tag, cls) => ({ cls: cls || "", appendChild() {}, append() {} }), icon: () => ({}),
    document: { createTextNode: (s) => s } }, simdi || "2026-11-24T20:00:00");
  c.renderWeek(h);
  return { on: kutu.kids.map((k) => (/\bon\b/.test(k.cls) ? 1 : 0)).join(""), today: kutu.kids.findIndex((k) => /\btoday\b/.test(k.cls)), not: not.textContent, kids: kutu.kids };
}

test("delgi karti: hafta Pazartesi baslar, bugun Sali", () => {
  const r = hafta({ streak: 0, xp_today: 0 });
  assert.equal(r.today, 1); assert.equal(r.on, "0000000"); assert.equal(r.not, "wk0");
});
test("delgi karti: bugun oynandi, seri 2: Pazartesi ve Sali delik", () => {
  const r = hafta({ streak: 2, xp_today: 30 });
  assert.equal(r.on, "1100000"); assert.equal(r.not, "wkOn:2");
});
test("delgi karti: bugun oynanmadi, seri 1: yalnizca dun delik", () => {
  const r = hafta({ streak: 1, xp_today: 0 });
  assert.equal(r.on, "1000000"); assert.equal(r.not, "wkRisk:1");
});
test("delgi karti: seri haftadan uzun olsa da tasmaz", () => {
  assert.equal(hafta({ streak: 40, xp_today: 10 }).on, "1100000");
});
test("delgi karti: sunucu seriyi 0 dese de bugun oynandiysa bugun delinir", () => {
  const r = hafta({ streak: 0, xp_today: 10 });
  assert.equal(r.on, "0100000"); assert.equal(r.not, "wkOn:1");
});
test("delgi karti: yeni delik animasyonu gunde bir kez", () => {
  const kutu = { kids: [], set textContent(v) { this.kids = []; }, appendChild(x) { this.kids.push(x); } };
  const c = yukle(["dayKey", "flags", "setFlag", "renderWeek"], { S: { ui: "tr" }, t: (k) => k, $: (id) => (id === "week" ? kutu : {}),
    el: (tag, cls) => ({ cls: cls || "", appendChild() {}, append() {} }), icon: () => ({}), document: { createTextNode: (s) => s } }, "2026-11-24T20:00:00");
  c.renderWeek({ streak: 1, xp_today: 10 }); assert.match(kutu.kids[1].cls, /fresh/);
  c.renderWeek({ streak: 1, xp_today: 20 }); assert.doesNotMatch(kutu.kids[1].cls, /fresh/);
});
test("delgi karti: Pazar gunu haftanin son hucresi bugundur", () => {
  assert.equal(hafta({ streak: 0, xp_today: 0 }, "2026-11-29T10:00:00").today, 6);
});

// Gorunum: varsayilan koyu; acik tema yalnizca kayitli secim "light" ise.
test("tema: varsayilan koyu, secilince acik, bozuk degerde koyu", () => {
  const attr = {}, meta = { content: "" };
  const c = yukle(["themeOf", "applyTheme"], { document: {
    documentElement: { setAttribute: (k, v) => { attr[k] = v; }, removeAttribute: (k) => { delete attr[k]; } },
    querySelector: () => ({ setAttribute: (k, v) => { meta[k] = v; } }) } });
  assert.equal(c.themeOf(), "dark"); c.applyTheme();
  assert.equal(attr["data-theme"], undefined); assert.equal(meta.content, "#170E12");
  c.store.set("theme", "light"); c.applyTheme();
  assert.equal(attr["data-theme"], "light"); assert.equal(meta.content, "#F1E8D6");
  c.store.set("theme", "pembe"); c.applyTheme();
  assert.equal(c.themeOf(), "dark"); assert.equal(attr["data-theme"], undefined);
});

// Aksam hatirlatmasi: gunde en cok bir, en cok 3 aksam, baski dili yok.
function hatirlat(h, simdi) {
  const c = yukle(["reminderPlan"], { t: (k, n) => k + (n === undefined ? "" : ":" + n) }, simdi);
  return Array.from(c.reminderPlan(h, new Date(simdi).getTime())).map((r) => ({ id: r.id, gun: r.at.getDate(), saat: r.at.getHours() + ":" + r.at.getMinutes(), body: r.body }));
}
test("hatirlatma: bugun oynanmadiysa ilki bu aksam 19:30, bekleyen kelimeyi soyler", () => {
  const r = hatirlat({ xp_today: 0, due: 8, streak: 12 }, "2026-11-24T10:00:00");
  assert.equal(r.length, 3); assert.deepEqual(r.map((x) => x.gun), [24, 25, 26]);
  assert.ok(r.every((x) => x.saat === "19:30")); assert.equal(r[0].body, "remDue:8");
  assert.deepEqual(r.map((x) => x.id), [71, 72, 73]);
});
test("hatirlatma: bugun oynandiysa bugun gelmez", () => {
  assert.deepEqual(hatirlat({ xp_today: 20, due: 0 }, "2026-11-24T10:00:00").map((x) => x.gun), [25, 26, 27]);
});
test("hatirlatma: saat 19:30'u gectiyse ilki yarin", () => {
  assert.equal(hatirlat({ xp_today: 0, due: 3 }, "2026-11-24T21:00:00")[0].gun, 25);
});
test("hatirlatma: bekleyen yoksa ve sonraki aksamlarda sade metin; seri hic gecmez", () => {
  const r = hatirlat({ xp_today: 0, due: 0, streak: 30 }, "2026-11-24T10:00:00");
  assert.ok(r.every((x) => x.body === "remPlain"));
  const r2 = hatirlat({ xp_today: 0, due: 5, streak: 30 }, "2026-11-24T10:00:00");
  assert.deepEqual(r2.map((x) => x.body), ["remDue:5", "remPlain", "remPlain"]);
});
test("hatirlatma metinleri: seri, kayip ve emoji yok (EN ve TR)", () => {
  const { kaynak } = require("./yukle.js");
  const src = require("node:fs").readFileSync(require("node:path").join(__dirname, "..", "..", "www", "app.js"), "utf8");
  const satirlar = src.split("\n").filter((l) => /remDue:|remAsk:/.test(l));
  assert.equal(satirlar.length, 4, "EN ve TR'de remDue ve remAsk satirlari");
  for (const l of satirlar) { const m = l.match(/rem(?:Due|Plain|Ask): "[^"]*"/g).join(" "); assert.doesNotMatch(m, /streak|seri|lose|kaybet|bitmesin|bozulmasın|\p{Extended_Pictographic}/iu); }
});

// v8 bonus karti: gunluk hedef dolunca gunde bir kez cikar.
function anaVeri(xpToday) { return { streak: 2, level: 1, xp_today: xpToday, due: 0 }; }
test("bonus karti: hedef dolunca gunde bir kez, ertesi gun yeniden", async () => {
  let xp = 30; const cikan = [];
  const dugum = { textContent: "", hidden: false, classList: { add() {}, remove() {} }, offsetWidth: 0 };
  const c = yukle(["dayKey", "flags", "setFlag", "refresh"], {
    S: { goal: 50, home: null }, t: (k) => k, $: () => dugum, Promise,
    api: async (p) => (p.indexOf("/api/ext/home") === 0 ? anaVeri(xp) : null), pairQ: () => "",
    planReminder: () => {}, confetti: () => {}, toast: () => {}, rankOf: () => 0, checkBadges: () => {},
    bonusCard: (h) => cikan.push(h.xp_today) }, "2026-11-24T20:00:00");
  await c.refresh(); assert.deepEqual(cikan, [], "hedefin altinda cikmaz");
  xp = 50; await c.refresh(); assert.deepEqual(cikan, [50], "hedef dolunca cikar");
  xp = 80; await c.refresh(); assert.deepEqual(cikan, [50], "ayni gun ikinci kez cikmaz");
  c.__saat("2026-11-25T09:00:00"); xp = 60; await c.refresh(); assert.deepEqual(cikan, [50, 60], "ertesi gun yeniden");
});
test("bonus karti: gorunur, XP'yi yazar, dokununca kapanir", () => {
  const sinif = new Set(), n = {}; const dug = (id) => (n[id] = n[id] || { id, textContent: "", hidden: true, onclick: null, classList: { add: (x) => sinif.add(x), remove: (x) => sinif.delete(x) } });
  const c = yukle(["bonusTimer", "bonusCard"], { $: dug, t: (k, v) => k + (v === undefined ? "" : ":" + v), sfx: () => {}, vibe: () => {}, calm: () => true,
    countUp: (node, to) => { node.textContent = String(to); }, setTimeout: (f, ms) => { if (ms === 0) f(); return 1; }, clearTimeout: () => {} });
  c.bonusCard({ xp_today: 60, streak: 0 });
  assert.equal(n.bonus.hidden, false); assert.equal(n.bonusN.textContent, "60"); assert.equal(n.bonusS.textContent, "bonusS:1");
  n.bonus.onclick(); assert.equal(n.bonus.hidden, true);
});

// Altyazi: cumlede kelime sari isaretlenir; baska kelimenin icindeki eslesme sayilmaz.
function altyazi() {
  const dugum = () => ({ parca: [], set textContent(v) { this.parca = v === "" ? [] : [String(v)]; }, append(...a) { this.parca.push(...a); } });
  const c = yukle(["wordRe", "subtitleInto"], { RegExp, el: (tag, cls, text) => ({ mark: text }), document: { createTextNode: (x) => x } });
  return { c, dugum };
}
test("altyazi: kelime cumlenin icinde isaretlenir, buyuk-kucuk harf fark etmez", () => {
  const { c, dugum } = altyazi(), n = dugum();
  assert.equal(c.subtitleInto(n, "Trust me, I never lie.", "trust"), true);
  assert.deepEqual(JSON.parse(JSON.stringify(n.parca)), ["", { mark: "Trust" }, " me, I never lie."]);
});
test("altyazi: baska kelimenin parcasi eslesmez, ozel karakter kirmaz, Turkce harf calisir", () => {
  const { c, dugum } = altyazi(); let n = dugum();
  assert.equal(c.subtitleInto(n, "They distrust him.", "trust"), false); assert.deepEqual(n.parca, ["They distrust him."]);
  n = dugum(); assert.equal(c.subtitleInto(n, "What (now)?", "(now)"), true);
  n = dugum(); assert.equal(c.subtitleInto(n, "Bu bir sır, kimseye söyleme.", "sır"), true);
  n = dugum(); assert.equal(c.subtitleInto(n, "sırdaş oldular", "sır"), false);
  n = dugum(); assert.equal(c.subtitleInto(n, "yalnizca kelime", ""), false);
});

// v8 "Altyaziyi tamamla": cumlesi olan kelimelerden soru kurar, bosluk birakir, 3 sik verir.
test("altyaziyi tamamla: bosluklu cumle, 3 sik, dogru cevap siklarda", async () => {
  const sorular = [], ham = [
    { w: "whisper", t: "fısıldamak", s: "Don't whisper in the dark." }, { w: "secret", t: "sır", s: "It is a secret." },
    { w: "trust", t: "güvenmek", s: "Trust me." }, { w: "sword", t: "kılıç", s: "He drew his sword." },
    { w: "guard", t: "muhafız", s: "" }, { w: "escape", t: "kaçmak", s: "This line has no such word." }];
  const c = yukle(["wordRe", "startCloze"], { RegExp, Set, S: { vocabRaw: ham, src: "en", dst: "tr" }, loadVocab: async () => ham, shuffle: (a) => a,
    toast: (m) => { throw new Error("beklenmeyen uyari: " + m); }, t: (k) => k, showView: () => {}, ask: (o) => sorular.push(o), $: () => ({}) });
  await c.startCloze();
  assert.equal(sorular.length, 1);
  const o = sorular[0];
  assert.equal(o.word, "Don't _____ in the dark."); assert.equal(o.n, 4, "cumlesi olmayan ve cumlesinde gecmeyen kelime alinmaz");
  assert.equal(o.options.length, 3); assert.ok(Array.from(o.options).includes("whisper")); assert.equal(o.ask, "qAskCloze");
});
test("altyaziyi tamamla: 4'ten az cumle varsa oyun acilmaz, uyari verir", async () => {
  const uyari = [], ham = [{ w: "trust", t: "güvenmek", s: "Trust me." }];
  const c = yukle(["wordRe", "startCloze"], { RegExp, Set, S: { vocabRaw: ham }, loadVocab: async () => ham, shuffle: (a) => a,
    toast: (m) => uyari.push(m), t: (k) => k, showView: () => { throw new Error("acilmamaliydi"); }, ask: () => {} });
  await c.startCloze(); assert.deepEqual(uyari, ["clozeNeed"]);
});

// Titresim dili: uc ayri desen, Ayarlar'dan kapanir.
test("titresim: dogru, yanlis ve kalici icin ayri desen; kapaliyken titremez", () => {
  const gelen = [];
  const c = yukle(["VIBE", "vibe"], { navigator: { vibrate: (p) => gelen.push(JSON.stringify(p)) } });
  assert.equal(c.vibe("ok"), true); assert.equal(c.vibe("bad"), true); assert.equal(c.vibe("keep"), true);
  assert.equal(new Set(gelen).size, 3, "uc desen birbirinden farkli");
  assert.equal(c.vibe("yok"), false);
  c.store.set("vib", "0"); assert.equal(c.vibe("ok"), false); assert.equal(gelen.length, 3);
});
test("titresim: telefon desteklemiyorsa hata vermez", () => {
  assert.equal(yukle(["VIBE", "vibe"], { navigator: {} }).vibe("ok"), false);
});
