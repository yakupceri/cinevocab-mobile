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
  return yukle(["OWN_MAX", "ownKey", "ownLoad", "dayKey", "demoState", "demoApi"], {
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

// Misafir Ben ekranini acabilir; hesap isteyen ekranlar hala kayit ekranina yollar.
test("misafir: Ben ve Ekle acilir, duello/lig kayit ister", () => {
  const acilan = [], istenen = [];
  const c = yukle(["go"], { S: { guest: true }, askAccount: () => istenen.push(1), showView: (id) => acilan.push(id),
    loadHome() {}, showWords() {}, addMode() {}, loadPacks() {}, loadPlay() {}, showMe: () => acilan.push("showMe"), loadLeagues() {}, say() {}, duelPart() {}, $: () => ({}) });
  c.go("v-me"); assert.deepEqual(acilan, ["v-me", "showMe"]); assert.equal(istenen.length, 0);
  c.go("v-add"); assert.deepEqual(acilan, ["v-me", "showMe", "v-add"]); assert.equal(istenen.length, 0);
  for (const v of ["v-duel", "v-leagues"]) c.go(v);
  assert.equal(istenen.length, 2); assert.deepEqual(acilan, ["v-me", "showMe", "v-add"]);
});
test("misafir Ben: yalnizca ayarlar kurulur, sunucuya istek gitmez", () => {
  const sinif = {}, n = {}, dug = (id) => (n[id] = n[id] || { classList: { toggle: (k, v) => { sinif[k] = v; } } });
  const c = yukle(["themeOf", "showMe"], { S: { guest: true, home: { username: "x" } }, $: dug,
    api: () => { throw new Error("misafirde istek gitmemeli"); }, refresh: () => { throw new Error("yenileme olmamali"); } });
  c.store.set("vib", "0"); c.store.set("theme", "light"); c.showMe();
  assert.equal(sinif["as-guest"], true); assert.equal(n.vibTgl.checked, false); assert.equal(n.themeSel.value, "light");
});

// v8 kelime akisi: dogru basina 10 XP, ust uste sayaci, yanlista sifir, 10 cevapta sunucuya gonderim.
function akis() {
  const giden = [], ses = [];
  const dug = () => ({ classList: { add() {}, remove() {} }, style: { setProperty() {} }, textContent: "" });
  const c = yukle(["F", "flowFlush", "flowAnswer"], { store: { get: () => null }, $: dug, S: { src: "en", dst: "tr", home: {} }, t: (k, n) => k + ":" + n,
    api: async (p, o) => { giden.push(o.body.items.length); return { xp: 0 }; }, buzz: () => {}, flowPop: () => {}, flowOpen: () => {}, confetti: () => {}, sfx: (k) => ses.push(k),
    calm: () => true, curView: "baska", setTimeout: () => 0, clearTimeout: () => {} });
  c.F.items = Array.from({ length: 40 }, (_, i) => ({ w: "w" + i, t: "t" + i })); c.F.i = 0;
  const cevap = (ok) => { c.F.busy = false; c.flowAnswer(ok); c.F.i++; };
  return { c, cevap, giden, ses };
}
test("kelime akisi: dogru 10 XP, ust uste artar, yanlista sifirlanir", () => {
  const { c, cevap } = akis();
  cevap(true); cevap(true); cevap(true);
  assert.equal(c.F.xp, 30); assert.equal(c.F.run, 3); assert.equal(c.F.ok, 3);
  cevap(false);
  assert.equal(c.F.xp, 30); assert.equal(c.F.run, 0); assert.equal(c.F.ok, 3); assert.equal(c.F.res.length, 4);
});
test("kelime akisi: her 10 cevapta bir sunucuya gider, ayni cevap iki kez gitmez", () => {
  const { c, cevap, giden } = akis();
  for (let i = 0; i < 9; i++) cevap(true);
  assert.deepEqual(giden, []);
  cevap(false); assert.deepEqual(giden, [10]);
  for (let i = 0; i < 5; i++) cevap(true);
  c.flowFlush(); assert.deepEqual(giden, [10, 5]);
  c.flowFlush(); assert.deepEqual(giden, [10, 5], "gonderilecek yeni cevap yokken istek gitmez");
});
test("kelime akisi: mesgulken ikinci dokunus sayilmaz", () => {
  const { c } = akis(); c.F.busy = false; c.flowAnswer(true); c.flowAnswer(true);
  assert.equal(c.F.xp, 10);
});

// Kartin altindaki ornek cumle: yalnizca kullanicinin listesinde o kelimeyle gecen cumle gosterilir.
test("ornek cumle: varsa cumle ve kaynak, yoksa bos (uydurulmaz)", () => {
  const ham = [{ w: "trust", s: "Trust me.", ep: "Deneme paketi" }, { w: "guard", s: "", ep: "x" }, { w: "sword", s: "No match here.", ep: "x" }];
  const c = yukle(["wordRe", "contextOf"], { RegExp, S: { vocabRaw: ham } });
  assert.deepEqual({ ...c.contextOf("trust") }, { s: "Trust me.", ep: "Deneme paketi" });
  for (const w of ["guard", "sword", "yok"]) assert.deepEqual({ ...c.contextOf(w) }, { s: "", ep: "" });
});

// Yakalanan hata: kart her yeni kelimede sinifini sifirliyordu ve krem kart bicimi kayboluyordu.
test("kart bicimi: yeni kelimede 'wcard' sinifi korunur", () => {
  const { kaynak } = require("./yukle.js");
  assert.match(kaynak("cardShow"), /className = "fcard wcard"/);
  assert.match(kaynak("flowShow"), /className = "fl-card wcard"/);
});

// Sonuc jenerigi: yalnizca gercek veri olan satirlar yazilir.
function jenerik(o, once, sonra) {
  const c = yukle(["rollRows"], { Set, t: (k, n) => k + (n === undefined ? "" : ":" + n) });
  return Array.from(c.rollRows(o, once, sonra), (r) => Array.from(r));
}
test("jenerik: bilinemeyen kelimeler bir kez ve adiyla, XP ve seri satiri", () => {
  const r = jenerik({ xp: 80, words: [{ w: "a", ok: true }, { w: "b", ok: false }, { w: "b", ok: false }, { w: "c", ok: false }] }, { mastered: 3 }, { mastered: 3, streak: 12 });
  assert.deepEqual(r, [["rollAgain", "b, c", "rollAgainSub"], ["rollStreak", "rollStreakN:12", ""], ["rollXp", "rollXpN:80", ""]]);
});
test("jenerik: kalici kelime farki sunucunun onceki ve sonraki sayisindan gelir", () => {
  assert.deepEqual(jenerik({ words: [] }, { mastered: 3 }, { mastered: 5, streak: 0 }), [["rollKeep", "rollKeepN:2", "rollKeepSub"]]);
  assert.deepEqual(jenerik({ words: [] }, { mastered: 5 }, { mastered: 5 }), [], "fark yoksa satir yok");
  assert.deepEqual(jenerik({ words: [] }, null, { mastered: 9 }), [], "onceki sayi bilinmiyorsa uydurulmaz");
});
test("jenerik: 4'ten fazla bilinemeyen kelime kisaltilir; veri yoksa satir yok", () => {
  const w = ["a", "b", "c", "d", "e", "f"].map((x) => ({ w: x, ok: false }));
  assert.equal(jenerik({ words: w }, null, null)[0][1], "a, b, c, d rollMore:2");
  assert.deepEqual(jenerik({ xp: 0 }, null, null), []);
});

// Alt menu oyun ekranlarinda gizli; bu yuzden her oyun ekraninda bir kapat dugmesi olmali (yoksa kullanici sikisir).
test("oyun ekranlari: alt menu gizliyse kapat dugmesi ya da ana sayfa dugmesi var", () => {
  const fs = require("node:fs"), path = require("node:path"), kok = path.join(__dirname, "..", "..", "www");
  const html = fs.readFileSync(path.join(kok, "index.html"), "utf8"), js = fs.readFileSync(path.join(kok, "app.js"), "utf8");
  const gizli = JSON.parse(js.match(/\$\("tabs"\)\.hidden = (\[[^\]]+\])\.includes\(id\)/)[1]);
  const cikis = { "v-quiz": "qClose", "v-cards": "cClose", "v-match": "mClose", "v-puzzle": "pzClose", "v-flow": "flClose", "v-result": "rHome" };
  for (const v of gizli.filter((x) => cikis[x])) {
    const bolum = html.slice(html.indexOf('<section id="' + v + '"'), html.indexOf("</section>", html.indexOf('<section id="' + v + '"')));
    assert.ok(bolum.includes('id="' + cikis[v] + '"'), v + " icinde " + cikis[v] + " yok");
    assert.ok(js.includes('$("' + cikis[v] + '").addEventListener("click"'), cikis[v] + " dinleyicisi yok");
  }
  assert.deepEqual(gizli.filter((x) => !cikis[x]).sort(), ["v-auth", "v-how", "v-start"]);
});

// Yakalanan hata (emulatorde gorulup dogrulandi): yari saydam kenar rengi + yuvarlak kose, Android WebView'de
// kaydirirken eski icerigin seritler halinde ekranda kalmasina yol aciyordu. Kenar renkleri opak olmali;
// kaydirilan alandaki kutularda saydamlik (opacity) kullanilmamali.
test("stil: kenar cizgisi opak, kutularda saydamlik yok", () => {
  const css = require("node:fs").readFileSync(require("node:path").join(__dirname, "..", "..", "www", "app.css"), "utf8");
  const cizgiler = css.match(/--line:\s*[^;]+;/g);
  assert.equal(cizgiler.length, 2, "koyu ve acik tema icin birer --line");
  for (const c of cizgiler) assert.match(c, /--line:\s*#[0-9A-Fa-f]{6};/, "opak olmali: " + c);
  for (const satir of css.split("\n")) {
    if (/border[^;{]*:\s*[^;]*rgba\(/.test(satir)) assert.fail("yari saydam kenar: " + satir.slice(0, 80));
    if (/^\.(tile|day|card|opt|post|wl|prog|chip)\b[^{]*\{[^}]*opacity:\s*\.\d/.test(satir)) assert.fail("kutuda saydamlik: " + satir.slice(0, 80));
  }
});

// Konumlandirma: "izledigin dizinin kelimeleri". Once kullanicinin kendi kelimeleri, tek one cikan is.
test("oyna: tek kutu one cikar; once tekrar, sonra gunluk oyunlar, yoksa akis", () => {
  const c = yukle(["hotTile"]);
  assert.equal(c.hotTile({ due: 5 }, { ready: true }, { ready: true }), "tCards");
  assert.equal(c.hotTile({ due: 0 }, { ready: true }, { ready: true, done: false }), "tPuzzle");
  assert.equal(c.hotTile({ due: 0 }, { ready: true }, { ready: true, done: true }), "tDaily");
  assert.equal(c.hotTile({ due: 0 }, { ready: true, done: true }, null), "tFlow");
  assert.equal(c.hotTile(null, null, null), "tFlow");
});
test("ana sayfa sahnesi: kullanicinin listesinden gercek cumle, gun icinde ayni, yoksa null", () => {
  const ham = [{ w: "trust", s: "Trust me.", ep: "Dizi 1" }, { w: "sword", s: "He drew his sword.", ep: "Dizi 2" }, { w: "guard", s: "" }, { w: "x", s: "kelime gecmiyor" }];
  const c = yukle(["wordRe", "heroScene"], { RegExp });
  const a = c.heroScene(ham, "2026-11-24"), b = c.heroScene(ham, "2026-11-24");
  assert.deepEqual({ ...a }, { ...b }); assert.ok(["trust", "sword"].includes(a.w)); assert.ok(a.s.toLowerCase().includes(a.w));
  const gunler = new Set(Array.from({ length: 20 }, (_, i) => c.heroScene(ham, "2026-11-" + (10 + i)).w));
  assert.equal(gunler.size, 2, "farkli gunlerde farkli sahneler gelir");
  assert.equal(c.heroScene([{ w: "guard", s: "" }], "2026-11-24"), null); assert.equal(c.heroScene(null, "x"), null);
});
test("ana sayfa sirasi: tekrari gelen kelimeler bulmacadan once", () => {
  const c = yukle(["dayKey", "flags", "todayItems"], { t: (k) => k, clock: () => "", go() {}, startPuzzle() {}, startDaily() {}, startCards() {},
    S: { home: { pair_words: 30, due: 12, new: 0 }, daily: { ready: true, total: 10 }, puzzle: { ready: true, total: 5 } } });
  assert.deepEqual(Array.from(c.todayItems(), (x) => x.id).slice(0, 3), ["cards", "puzzle", "daily"]);
  c.S.home = { pair_words: 2, due: 0, new: 0 };
  assert.equal(c.todayItems()[0].id, "add", "kelimesi olmayan kullanicida ilk is kelime getirmek");
});
test("karsilama sahnesi: deneme destesinden cumle ve anlam; Turkce arayuzde Ingilizce cumle", () => {
  const vm = require("node:vm"), fs = require("node:fs"), path = require("node:path");
  const kutu = {}; vm.runInNewContext(fs.readFileSync(path.join(__dirname, "..", "..", "www", "demo.js"), "utf8"), { globalThis: kutu, window: kutu });
  const c = yukle(["wordRe", "demoPick"], { RegExp, CVDEMO: kutu.CVDEMO, S: { src: "en", dst: "tr", ui: "tr" } });
  const d = c.demoPick();
  assert.ok(d && d.s && d.w && d.t); assert.match(d.s.toLowerCase(), new RegExp(d.w));
  c.S.src = "ja"; c.S.dst = "ko"; c.S.ui = "en";
  assert.ok(c.demoPick(), "deneme destesi olmayan cift icin en yakin cift kullanilir");
});
test("ekranlar: calismayan 'yakinda' kutusu yok, ilk secenek kendi metnini getirmek", () => {
  const html = require("node:fs").readFileSync(require("node:path").join(__dirname, "..", "..", "www", "index.html"), "utf8");
  assert.doesNotMatch(html, /Snap/);
  const parca = html.slice(html.indexOf('id="addPick"'));
  assert.equal(parca.match(/<button class="tile[^"]*" id="(\w+)"/)[1], "aPaste");
  assert.equal((html.match(/class="tile hot"/g) || []).length, 1, "sabit one cikan kutu yalnizca ekle ekraninda, bir tane");
  assert.doesNotMatch(html, /id="v-how"/, "ilk acilista 'nasil baslamak istersin' ekrani yok");
  const kaynaklar = html.slice(html.indexOf('id="addPick"'), html.indexOf('id="addForm"')).match(/<button class="tile[^"]*" id="(\w+)"/g).length;
  assert.equal(kaynaklar, 3, "ekle ekraninda uc kaynak: yapistir, fotograf, hazir set");
});

// Kelimenin gectigi cumle: kullanicinin metninden bulunur, yalnizca telefonda saklanir.
function cumleler() { return yukle(["CTX_MAX", "wordRe", "contextsFor", "ctxLoad", "ctxSave", "ctxClear"], { RegExp, Object, LANGS: ["en", "tr"] }); }
test("cumle: her kelime icin gectigi ilk satir; baska kelimenin parcasi ve cok uzun satir sayilmaz", () => {
  const c = cumleler(), uzun = "trust " + "x".repeat(200);
  const r = c.contextsFor(["trust", "guard", "yok"], [uzun, "They distrust him.", "Trust me, I never lie.", "The guard never saw us."]);
  assert.deepEqual({ ...r }, { trust: "Trust me, I never lie.", guard: "The guard never saw us." });
});
test("cumle deposu: dil basina ayri, ust sinirda en eskiler duser, bozuk veri bos sayilir, temizlenir", () => {
  const c = cumleler();
  assert.equal(c.ctxSave("en", { trust: "Trust me." }), 1); assert.equal(c.ctxLoad("en").trust, "Trust me."); assert.deepEqual({ ...c.ctxLoad("tr") }, {});
  const cok = {}; for (let i = 0; i < c.CTX_MAX + 10; i++) cok["w" + i] = "satir " + i;
  assert.equal(c.ctxSave("en", cok), c.CTX_MAX);
  const son = c.ctxLoad("en"); assert.equal(son.trust, undefined, "en eski kayit dustu"); assert.equal(son["w" + (c.CTX_MAX + 9)], "satir " + (c.CTX_MAX + 9));
  c.store.set("ctx-tr", "{bozuk"); assert.deepEqual({ ...c.ctxLoad("tr") }, {});
  c.ctxClear(); assert.equal(c.store.get("ctx-en"), null);
});
test("cumle sunucuya gitmez: ekleme istegi bos cumle yollar", () => {
  const js = require("node:fs").readFileSync(require("node:path").join(__dirname, "..", "..", "www", "app.js"), "utf8");
  const istek = js.slice(js.indexOf('api("/translate-words"'), js.indexOf('api("/translate-words"') + 260);
  assert.match(istek, /sentence: ""/); assert.doesNotMatch(istek, /lines|ctx/);
});

// "Paylas -> CineVocab": gelen metnin ayristirilmasi ve yonlendirme.
function paylas(ortam) { return yukle(["shareParse", "pendingShare", "shareOpen", "sharePending"], Object.assign({ RegExp, CVTEXT: { MAX_CHARS: 400000 } }, ortam || {})); }
test("paylasim: secilen metin oldugu gibi alinir, icindeki link atilir", () => {
  const r = paylas().shareParse("He was reluctant to leave the house that night.\nhttps://example.com/a?b=1", "Bir makale");
  assert.equal(r.text, "He was reluctant to leave the house that night."); assert.equal(r.title, "Bir makale"); assert.equal(r.linkOnly, false); assert.equal(r.empty, false);
});
test("paylasim: yalnizca link (YouTube, tarayici) metin sayilmaz, baslik korunur", () => {
  const c = paylas();
  let r = c.shareParse("https://youtu.be/abc123XYZ", "Bir video adi");
  assert.equal(r.linkOnly, true); assert.equal(r.text, ""); assert.equal(r.title, "Bir video adi");
  r = c.shareParse("Bir video adi https://youtu.be/abc123XYZ", "Bir video adi");
  assert.equal(r.linkOnly, true, "basligi metne de koyan uygulamalar");
  r = c.shareParse("Bak: https://example.com", ""); assert.equal(r.linkOnly, true);
});
test("paylasim: bos ya da yalnizca isaret gelirse acilmaz; cok uzun metin kirpilir", () => {
  const c = paylas();
  assert.equal(c.shareParse("  ...  ", "").empty, true); assert.equal(c.shareParse("", "").empty, true);
  assert.equal(c.shareParse("kelime ".repeat(100000), "").text.length <= 400000, true);
  assert.equal(c.shareParse("metin burada yeterince uzun bir cumle", "x".repeat(300)).title.length, 60);
});
function yonlendir(S) {
  const olay = [], n = {}, dug = (id) => (n[id] = n[id] || { value: "", hidden: false });
  const c = paylas({ S, $: dug, t: (k) => k, go: (v) => olay.push("go:" + v), addMode: (f) => olay.push("form:" + f), askAccount: () => olay.push("hesap"), toast: (m) => olay.push("uyari:" + m), say: (node, m) => olay.push("mesaj:" + m) });
  return { c, olay, n };
}
test("paylasim: giris yapmis kullanicida form metinle acilir, hicbir sey gonderilmez", () => {
  const { c, olay, n } = yonlendir({ key: "k" });
  assert.equal(c.shareOpen(c.shareParse("He was reluctant to leave the house.", "Kaynak")), true);
  assert.deepEqual(olay, ["go:v-add", "form:true", "mesaj:", "mesaj:shareReady"]); assert.equal(n.text.value, "He was reluctant to leave the house."); assert.equal(n.srcTitle.value, "Kaynak");
});
test("paylasim: yalnizca linkte form bos acilir ve neden bos oldugunu soyler", () => {
  const { c, olay, n } = yonlendir({ key: "k" });
  c.shareOpen(c.shareParse("https://youtu.be/abc", "Video adi"));
  assert.equal(olay[3], "mesaj:shareLink"); assert.equal(n.text.value, ""); assert.equal(n.srcTitle.value, "Video adi");
});
test("paylasim: uygulamaya hic girilmemisse metin bellekte bekler; giris ya da misafir olunca form acilir", () => {
  const S = { key: "", guest: false }, { c, olay, n } = yonlendir(S);
  assert.equal(c.shareOpen(c.shareParse("He was reluctant to leave the house.", "")), false);
  assert.deepEqual(olay, ["hesap", "mesaj:shareNeedAcc"]); assert.ok(c.pendingShare);
  c.sharePending(); assert.equal(olay.length, 2, "giris yokken acilmaz");
  S.key = "yeni"; c.sharePending();
  assert.deepEqual(olay.slice(2), ["go:v-add", "form:true", "mesaj:", "mesaj:shareReady"]); assert.equal(n.text.value, "He was reluctant to leave the house."); assert.equal(c.pendingShare, null);
});
test("paylasim: Android tarafi yalnizca duz metin kabul eder, yeni izin yok", () => {
  const fs = require("node:fs"), path = require("node:path"), kok = path.join(__dirname, "..", "..", "android", "app", "src", "main");
  const m = fs.readFileSync(path.join(kok, "AndroidManifest.xml"), "utf8");
  assert.equal((m.match(/android\.intent\.action\.SEND/g) || []).length, 2); assert.match(m, /mimeType="text\/plain"/); assert.doesNotMatch(m, /SEND_MULTIPLE|\*\/\*/);
  assert.deepEqual((m.match(/uses-permission android:name="([^"]+)"/g) || []).map((x) => x.split(".").pop().replace('"', "")).filter((x) => x !== "SCHEDULE_EXACT_ALARM").sort(), ["INTERNET", "VIBRATE"]);
  assert.match(m, /SCHEDULE_EXACT_ALARM" tools:node="remove"/, "tam zamanli alarm izni cikarilmis olmali");
});
test("paylasim: hic girilmemisken yalnizca link gelirse kayit istenmez, neden bos oldugu soylenir", () => {
  const { c, olay } = yonlendir({ key: "", guest: false });
  assert.equal(c.shareOpen(c.shareParse("https://youtu.be/abc", "Video")), false);
  assert.deepEqual(olay, ["uyari:shareLink"]); assert.equal(c.pendingShare, null);
});

// Gorselden altyazi: okunan ham satirlarin ayiklanmasi ve yonlendirme.
test("gorselden okuma: saat, sayac ve harfsiz satirlar atilir, altyazi kalir", () => {
  const c = yukle(["ocrClean"]);
  const ham = ["12:34 / 1:02:11", "1,2 Mn goruntuleme", "He was reluctant to leave.", "He was reluctant to leave.", "HD", ">> ||", "", "  She gave him   a fierce look. ", "2026-11-24"].join("\n");
  assert.equal(c.ocrClean(ham), "1,2 Mn goruntuleme\nHe was reluctant to leave.\nShe gave him a fierce look.");
  assert.equal(c.ocrClean("12:34\n...\n42"), ""); assert.equal(c.ocrClean(null), "");
});
test("gorselden okuma: bos sonucta uyarir, form acmaz; dolu sonucta formu 'gorselden okundu' notuyla acar", () => {
  const olay = [];
  const c = yukle(["OCR_SCRIPTS", "ocrClean", "ocrOpen"], { S: { src: "en" }, CVTEXT: { MAX_CHARS: 400000 }, t: (k) => k, toast: (m) => olay.push("uyari:" + m), shareOpen: (sh) => { olay.push(sh); return true; } });
  assert.equal(c.ocrOpen("12:34\n..."), false); assert.deepEqual(olay, ["uyari:ocrEmpty"]);
  assert.equal(c.ocrOpen("He was reluctant to leave."), true);
  assert.equal(olay[1].text, "He was reluctant to leave."); assert.equal(olay[1].photo, true); assert.equal(olay[1].linkOnly, false);
  c.S.src = "ja"; c.ocrOpen("He was reluctant to leave."); assert.equal(olay[2], "uyari:ocrLang", "Latin disi dilde acikca soyler");
});
test("gorselden okuma: Android yalnizca metin ve gorsel alir, kamera izni yok, okuma cihaz ici", () => {
  const fs = require("node:fs"), path = require("node:path"), kok = path.join(__dirname, "..", "..", "android", "app");
  const m = fs.readFileSync(path.join(kok, "src", "main", "AndroidManifest.xml"), "utf8"), g = fs.readFileSync(path.join(kok, "build.gradle"), "utf8");
  assert.deepEqual((m.match(/mimeType="([^"]+)"/g) || []).sort(), ['mimeType="image/*"', 'mimeType="text/plain"']);
  assert.doesNotMatch(m, /READ_EXTERNAL|READ_MEDIA|RECORD_AUDIO|ACCESS_\w*LOCATION/, "depolama, mikrofon, konum izni yok");
  assert.doesNotMatch(m, /permission\.CAMERA/, "kamera izni yok: fotografi telefonun kamera uygulamasi ceker");
  assert.match(m, /<queries>[\s\S]*android\.media\.action\.IMAGE_CAPTURE[\s\S]*<\/queries>/, "kamera uygulamasi gorunur olmali, yoksa galeriye duser");
  assert.match(g, /com\.google\.mlkit:text-recognition:/, "model uygulamayla gelir"); assert.doesNotMatch(g, /play-services-mlkit/, "indirmeli surum degil");
});

// Herkes anlasin: gorunen metinde oyun jargonu yok, ilk acilis kisa.
test("metin: kullaniciya gorunen yerde 'XP' ve 'seans' yok (TR), 'XP' yok (EN)", () => {
  const L = require("node:fs").readFileSync(require("node:path").join(__dirname, "..", "..", "www", "app.js"), "utf8").split("\n");
  const en = L.slice(45, 127).join("\n"), tr = L.slice(127, 209).join("\n");
  assert.match(en, /authH:/); assert.match(tr, /authH: "İzlediğin/, "satir araligi sozluklere denk geliyor");
  assert.doesNotMatch(en, /\bXP\b/); assert.doesNotMatch(tr, /\bXP\b/);
  const seans = (tr.match(/[a-zA-Z]+: "[^"]*[Ss]eans[^"]*"/g) || []).filter((x) => !/^(homeH|themeDark):/.test(x));
  assert.deepEqual(seans, [], "'seans' yalnizca baslikta ve tema adinda kalabilir");
});
test("ilk acilis: dil secildikten sonra soru sormadan ilk kelime karti acilir", () => {
  const js = require("node:fs").readFileSync(require("node:path").join(__dirname, "..", "..", "www", "app.js"), "utf8");
  const blok = js.slice(js.indexOf('$("oGo").addEventListener'), js.indexOf('$("oGo").addEventListener') + 900);
  assert.match(blok, /store\.get\("how"\) === null[\s\S]*return startFlow\(\)/); assert.doesNotMatch(js, /showView\("v-how"/);
});
test("kelime akisi: kartlarla ayni yon (saga bildim, sola tekrar)", () => {
  const js = require("node:fs").readFileSync(require("node:path").join(__dirname, "..", "..", "www", "app.js"), "utf8");
  assert.match(js, /flowAnswer\(F\.dy > 0\)/); assert.match(js, /cardAnswer\(C\.dx > 0\)/);
});

// Puan ve seviye karti Ben ekraninda cizilir.
test("ilerleme karti: puan hedefi, kalan ve seviye dogru yazilir; hedef dolunca 'tamam'", () => {
  const n = {}, sinif = {}, dug = (id) => (n[id] = n[id] || { textContent: "", style: {} });
  const c = yukle(["renderMeter"], { S: { goal: 50 }, $: dug, t: (k, a, b) => k + ":" + [a, b].filter((x) => x !== undefined).join(","),
    document: { querySelector: () => ({ classList: { toggle: (k, v) => { sinif[k] = v; } } }) } });
  c.renderMeter({ xp_today: 30, level: 2, xp_level: 200, xp_into: 80 });
  assert.equal(n.goalNum.textContent, "goalNum:30,50"); assert.equal(n.goalSub.textContent, "goalLeft:20"); assert.equal(n.goalFill.style.width, "60%");
  assert.equal(n.lvlName.textContent, "lvlName:2"); assert.equal(n.lvlLeft.textContent, "lvlLeft:120,3"); assert.equal(n.lvlFill.style.width, "40%"); assert.equal(sinif.done, false);
  c.renderMeter({ xp_today: 90, level: 2, xp_level: 200, xp_into: 80 });
  assert.equal(n.goalSub.textContent, "goalDone:"); assert.equal(n.goalFill.style.width, "100%"); assert.equal(sinif.done, true);
});

test("Ingilizce tekil: '1 days' yazilmaz; Turkcede dokunulmaz", () => {
  const T = { en: { a: "{0} days in a row", b: "{0} points", c: "{0} words" }, tr: { a: "{0} gün üst üste" } }, S = { ui: "en" };
  const c = yukle(["t"], { T, S });
  assert.equal(c.t("a", 1), "1 day in a row"); assert.equal(c.t("a", 2), "2 days in a row"); assert.equal(c.t("a", 11), "11 days in a row");
  assert.equal(c.t("b", 1), "1 point"); assert.equal(c.t("c", 21), "21 words");
  S.ui = "tr"; assert.equal(c.t("a", 1), "1 gün üst üste");
});

// Yakalanan hata (emulatorde): tam zamanli alarm izni olmadan hatirlatma kurulunca eklenti kullaniciyi sistem ayar ekranina
// yolluyor ve kurma cagrisi hic donmuyordu. Hatirlatma "tam zamanli degil" diye isaretlenmeli.
test("hatirlatma: tam zamanli alarm istenmez (ayar ekranina yollamaz)", () => {
  const { kaynak } = require("./yukle.js");
  assert.match(kaynak("planReminder"), /isExactNotification: false/);
});

// Misafirin kendi metninden kelime cikarmasi: secim telefonda, ceviri adsiz, liste telefonda, giriste hesaba tasinir.
function misafirKendi(ortam) {
  return yukle(["OWN_MAX", "ownKey", "ownLoad", "ownSave", "guestPlan", "anonPost", "guestAdd", "ownTransfer", "CTX_MAX", "ctxLoad", "ctxSave", "wordRe", "contextsFor"],
    Object.assign({ RegExp, Set, Object, S: { src: "en", dst: "tr", key: "", guest: true }, API: "https://sunucu.test" }, ortam || {}));
}
test("misafir plani: sunucudaki siralama (sik gecen, sonra uzun), listede olan atilir, ust sinir", () => {
  const c = misafirKendi();
  const sayim = [["the", 9], ["reluctant", 2], ["fierce", 2], ["a", 7], ["shadow", 1], ["trust", 1]];
  const p = c.guestPlan(sayim, ["trust"], 3);
  assert.deepEqual(Array.from(p.pick), ["the", "a", "reluctant"]); assert.equal(p.total, 6); assert.equal(p.saved, 1); assert.equal(p.fresh, 5); assert.equal(p.full, false);
  assert.equal(c.guestPlan(sayim, [], 100).pick.length, 6, "istenen 100 olsa da en cok " + c.OWN_PICK);
  const dolu = Array.from({ length: c.OWN_MAX }, (_, i) => "w" + i);
  assert.equal(c.guestPlan(sayim, dolu, 10).full, true); assert.equal(c.guestPlan(sayim, dolu, 10).pick.length, 0);
});
test("misafir ekleme: oturum anahtari olmadan gider, kaynak basligi ve metin gitmez; cevrilenler telefonda saklanir", async () => {
  const giden = [];
  const c = misafirKendi({ AbortController, setTimeout, clearTimeout, JSON,
    fetch: async (url, o) => { giden.push({ url, headers: o.headers, body: JSON.parse(o.body) }); return { ok: true, json: async () => ({ results: { reluctant: "isteksiz", fierce: " sert " }, pending: ["zzz"] }) }; } });
  const n = await c.guestAdd(["reluctant", "fierce", "zzz"], ["He was reluctant to leave.", "A fierce look."], "Benim dizim");
  assert.equal(n, 2, "cevirisi gelmeyen kelime eklenmez");
  assert.equal(giden.length, 1); assert.equal(giden[0].url, "https://sunucu.test/translate-words");
  assert.equal(giden[0].headers.Authorization, undefined, "oturum anahtari gitmez");
  assert.equal(giden[0].body.episode, ""); assert.equal(giden[0].body.sentence, ""); assert.deepEqual(giden[0].body.words, ["reluctant", "fierce", "zzz"]);
  assert.doesNotMatch(JSON.stringify(giden[0].body), /to leave|A fierce|Benim dizim/, "metnin kendisi ve basligi gitmez");
  const l = c.ownLoad().map((x) => ({ ...x }));
  assert.deepEqual(l, [{ w: "fierce", t: "sert", s: "A fierce look.", ep: "Benim dizim" }, { w: "reluctant", t: "isteksiz", s: "He was reluctant to leave.", ep: "Benim dizim" }]);
  assert.equal(await c.guestAdd(["reluctant"], [], ""), 0, "ayni kelime ikinci kez eklenmez");
});
test("misafir ekleme: sunucuya ulasilamazsa hata vermez, 0 doner", async () => {
  const c = misafirKendi({ AbortController, setTimeout, clearTimeout, JSON, fetch: async () => { throw new Error("ag yok"); } });
  assert.equal(await c.guestAdd(["reluctant"], [], ""), 0); assert.equal(c.ownLoad().length, 0);
});
test("misafir destesi: kendi kelimeleri once gelir, deneme destesiyle cakisan tekrarlanmaz", () => {
  const c = yukle(["OWN_MAX", "ownKey", "ownLoad", "dayKey", "demoState", "demoApi"], { S: { src: "en", dst: "tr" }, t: (k) => k, shuffle: (a) => a, askAccount() {},
    CVDEMO: { words: () => [{ tr: "whisper", eng: "fısıldamak", sentence: "" }, { tr: "trust", eng: "güvenmek", sentence: "" }] } });
  c.store.set("own-en-tr", JSON.stringify([{ w: "reluctant", t: "isteksiz", s: "He was reluctant.", ep: "Dizim" }, { w: "trust", t: "güven", s: "", ep: "Dizim" }]));
  const v = Array.from(c.demoApi("/api/vocab", {}).words, (x) => x.tr + "=" + x.eng);
  assert.deepEqual(v, ["reluctant=isteksiz", "trust=güven", "whisper=fısıldamak"]);
  assert.equal(c.demoApi("/api/vocab", {}).words[0].sentence, "He was reluctant.");
});
test("hesaba tasima: giriste kendi kelimeleri kaynak basligiyla gider, cumleler telefonda kalir, liste silinir", async () => {
  const giden = [], S = { src: "en", dst: "tr", key: "", guest: true };
  const c = misafirKendi({ S, api: async (p, o) => { giden.push([p, o.body.episode, Array.from(o.body.words)]); return {}; } });
  c.store.set("own-en-tr", JSON.stringify([{ w: "reluctant", t: "isteksiz", s: "He was reluctant.", ep: "Dizim" }, { w: "fierce", t: "sert", s: "", ep: "" }]));
  assert.equal(await c.ownTransfer(), 0, "oturum yokken tasinmaz"); assert.equal(giden.length, 0);
  S.key = "k";
  assert.equal(await c.ownTransfer(), 2);
  assert.deepEqual(giden, [["/translate-words", "Dizim", ["reluctant"]], ["/translate-words", "", ["fierce"]]]);
  assert.equal(c.store.get("own-en-tr"), null); assert.equal(c.ctxLoad("en").reluctant, "He was reluctant.");
  assert.equal(await c.ownTransfer(), 0, "ikinci kez tasinmaz");
});
test("hesaba tasima: sunucu hata verirse liste telefonda kalir", async () => {
  const c = misafirKendi({ S: { src: "en", dst: "tr", key: "k" }, api: async () => { throw new Error("x"); } });
  c.store.set("own-en-tr", JSON.stringify([{ w: "reluctant", t: "isteksiz", s: "", ep: "" }]));
  assert.equal(await c.ownTransfer(), 0); assert.equal(c.ownLoad().length, 1);
});
test("misafir: tekrar oturumunda ve ana karede once kendi kelimeleri", () => {
  const c = yukle(["OWN_MAX", "ownKey", "ownLoad", "dayKey", "demoState", "demoApi"], { S: { src: "en", dst: "tr" }, t: (k) => k, shuffle: (a) => a, askAccount() {}, Set,
    CVDEMO: { words: () => Array.from({ length: 16 }, (_, i) => ({ tr: "demo" + i, eng: "d" + i, sentence: "" })) } });
  c.store.set("own-en-tr", JSON.stringify([{ w: "reluctant", t: "isteksiz", s: "", ep: "Dizim" }, { w: "fierce", t: "sert", s: "", ep: "Dizim" }]));
  const w = Array.from(c.demoApi("/api/srs/session", {}).words, (x) => x.tr);
  assert.deepEqual(w.slice(0, 2), ["reluctant", "fierce"]); assert.equal(w.length, 10);
  const h = yukle(["wordRe", "heroScene"], { RegExp });
  const ham = [{ w: "forgive", s: "I will never forgive you.", ep: "demoPack" }, { w: "reluctant", s: "He was reluctant.", ep: "Dizim" }];
  for (const gun of ["2026-11-24", "2026-11-25", "2026-11-26", "2026-11-27"]) assert.equal(h.heroScene(ham, gun, (x) => x.ep !== "demoPack").w, "reluctant");
  assert.equal(h.heroScene([ham[0]], "2026-11-24", (x) => x.ep !== "demoPack").w, "forgive", "kendi cumlesi yoksa deneme destesinden");
});

test("logo: ust seritte delikli bilet var, harfler cizim (yazi degil); acik temada rengi degisir", () => {
  const fs = require("node:fs"), path = require("node:path"), kok = path.join(__dirname, "..", "..", "www");
  const html = fs.readFileSync(path.join(kok, "index.html"), "utf8"), css = fs.readFileSync(path.join(kok, "app.css"), "utf8");
  const ust = html.slice(html.indexOf('<header class="top">'), html.indexOf("</header>"));
  assert.match(ust, /<svg viewBox="0 0 432 320"><use href="#i-logo"\/>/, "dis kutu 0 0'dan baslamali, yoksa logo kirpilir"); assert.doesNotMatch(ust, />Cv</, "harfler yazi tipi gerektirmeyen cizim olmali");
  const sembol = html.slice(html.indexOf('<symbol id="i-logo"'), html.indexOf("</symbol>", html.indexOf('<symbol id="i-logo"')));
  assert.match(sembol, /fill="var\(--lc\)" mask="url\(#cvdelik\)"/); assert.match(html, /<mask id="cvdelik">[\s\S]*stroke-dasharray/, "Cv ve yirtma cizgisi biletten oyulur");
  assert.match(css, /\.logo \{ --lc: var\(--sun\);/); assert.match(css, /\[data-theme="light"\] \.logo \{ --lc: var\(--hi\); \}/);
});



// Dublaj: kelimeyi anlamiyla eslestirme oyunu. Dil ciftinden bagimsiz; mantik sahte DOM ile sinanir.
function dublaj(ortam) {
  return yukle(["MATCH_ROWS", "MT", "matchPool", "matchTiles", "matchSetup", "matchJudge", "matchRemove"], Object.assign({ Set, shuffle: (a) => a }, ortam || {}));
}
test("dublaj havuzu: once tekrari gelenler; ayni kelime ya da ayni anlam iki kez gelmez; ust sinir", () => {
  const c = dublaj();
  const ilk = [{ w: "trust", t: "güvenmek" }, { w: "Trust", t: "güven" }], kalan = [{ w: "rely", t: "Güvenmek" }, { w: "sword", t: "kılıç" }, { w: "x", t: "x" }, { w: "", t: "bos" }, null, { w: "guard", t: "muhafız" }];
  assert.deepEqual(Array.from(c.matchPool(ilk, kalan, 12), (x) => x.w), ["trust", "sword", "guard"]);
  assert.equal(c.matchPool(Array.from({ length: 30 }, (_, i) => ({ w: "w" + i, t: "t" + i })), [], 12).length, 12);
});
test("dublaj her dil ciftinde calisir: kelime ve anlam oldugu gibi kullanilir (Fransizca, Japonca, Arapca)", () => {
  const c = dublaj();
  const p = c.matchPool([{ w: "chuchoter", t: "to whisper" }, { w: "秘密", t: "secret" }, { w: "سيف", t: "kılıç" }, { w: "Schatten", t: "ombre" }], [], 12);
  assert.equal(p.length, 4);
  const kutular = Array.from(c.matchTiles(p[1]), (x) => ({ ...x }));
  assert.deepEqual(kutular, [{ w: "秘密", kind: "s", text: "秘密" }, { w: "秘密", kind: "t", text: "secret" }]);
});
test("dublaj tahtasi: ilk 5 cift iki sutuna dagilir, kalani sirada bekler; her kelimenin iki kutusu vardir", () => {
  const c = dublaj(), ciftler = Array.from({ length: 8 }, (_, i) => ({ w: "w" + i, t: "t" + i })), b = c.matchSetup(ciftler);
  assert.equal(b.cols[0].length, 5); assert.equal(b.cols[1].length, 5); assert.equal(b.queue.length, 3);
  const hepsi = b.cols[0].concat(b.cols[1]);
  for (let i = 0; i < 5; i++) assert.deepEqual(Array.from(hepsi).filter((x) => x.w === "w" + i).map((x) => x.kind).sort(), ["s", "t"]);
  const az = c.matchSetup(ciftler.slice(0, 4)); assert.equal(az.cols[0].length + az.cols[1].length, 8); assert.equal(az.queue.length, 0);
});
test("dublaj dokunus: ayni kutu, ayni turden kutu, eslesme ve yanlis ayirt edilir", () => {
  const c = dublaj(), s1 = { w: "a", kind: "s" }, t1 = { w: "a", kind: "t" }, s2 = { w: "b", kind: "s" }, t2 = { w: "b", kind: "t" };
  assert.equal(c.matchJudge(s1, s1), "same"); assert.equal(c.matchJudge(s1, s2), "switch"); assert.equal(c.matchJudge(t1, t2), "switch");
  assert.equal(c.matchJudge(s1, t1), "match"); assert.equal(c.matchJudge(t1, s1), "match", "once anlamina dokunmak da olur");
  assert.equal(c.matchJudge(s1, t2), "wrong");
});
test("dublaj dusme: eslesen kutular cikar, ustundekiler asagi iner, yeni cift bosalan sutunlarin tepesine gelir", () => {
  const c = dublaj(), b = c.matchSetup(Array.from({ length: 7 }, (_, i) => ({ w: "w" + i, t: "t" + i })));
  const a = b.cols[0].find((x) => x.kind === "s"), es = b.cols[0].concat(b.cols[1]).find((x) => x.w === a.w && x.kind === "t");
  const altindaki = b.cols[0][b.cols[0].indexOf(a) + 1], yeni = c.matchRemove(b.cols, a, es, b.queue);
  assert.equal(yeni.length, 2); assert.equal(b.queue.length, 1);
  assert.equal(b.cols[0].length + b.cols[1].length, 10, "tahta dolu kalir");
  assert.ok(!b.cols[0].includes(a) && !b.cols[1].includes(es));
  for (const y of yeni) assert.ok(b.cols[0][0] === y || b.cols[1][0] === y || b.cols[0][1] === y || b.cols[1][1] === y, "yeni kutular tepede");
  if (altindaki && altindaki !== es) assert.ok(b.cols[0].includes(altindaki), "eslesmeyen kutu tahtada kalir");
  // sira bitince tahta kuculur ve sonunda bosalir
  let adim = 0;
  while (b.cols[0].length + b.cols[1].length && adim++ < 20) {
    const hepsi = b.cols[0].concat(b.cols[1]), s = hepsi.find((x) => x.kind === "s"), t = hepsi.find((x) => x.w === s.w && x.kind === "t");
    c.matchRemove(b.cols, s, t, b.queue);
  }
  assert.equal(b.cols[0].length + b.cols[1].length, 0); assert.equal(b.queue.length, 0); assert.equal(adim, 6, "kalan 6 cift tek tek eslesti");
});
test("dublaj ekrani: Oyna'da kutusu var, kapat dugmesi var, metinler EN ve TR'de var", () => {
  const fs = require("node:fs"), path = require("node:path"), kok = path.join(__dirname, "..", "..", "www");
  const html = fs.readFileSync(path.join(kok, "index.html"), "utf8"), L = fs.readFileSync(path.join(kok, "app.js"), "utf8").split("\n");
  assert.match(html, /id="tMatch"[\s\S]*data-i="matchH"/); assert.match(html, /<section id="v-match"[\s\S]*id="mClose"[\s\S]*id="mGrid"/);
  for (const k of ["matchH", "matchS", "matchHint", "matchRes"]) { assert.ok(L.slice(45, 127).join("").includes(k + ': "'), "EN " + k); assert.ok(L.slice(127, 209).join("").includes(k + ': "'), "TR " + k); }
});

// Dublaj'in gosterisi: kivilcim ve yukselen yazi. Azaltilmis harekette hic calismaz; seri esiklerinde buyur.
test("kivilcim: hareket azaltilmissa cizilmez; normalde parca uretir ve tek cizim dongusu baslar", () => {
  let dongu = 0;
  const c = yukle(["SPARK", "sparkAt", "sparkLink"], { calm: () => true, sparkRun: () => { dongu++; }, Math });
  assert.equal(c.sparkAt(100, 100, 14, false), 0); c.sparkLink(0, 0, 10, 10);
  assert.equal(c.SPARK.ps.length, 0); assert.equal(c.SPARK.lines.length, 0); assert.equal(dongu, 0);
  const d = yukle(["SPARK", "sparkAt", "sparkLink"], { calm: () => false, sparkRun: () => { dongu++; }, Math });
  assert.equal(d.sparkAt(100, 100, 14, false), 14); d.sparkLink(0, 0, 10, 10);
  assert.equal(d.SPARK.ps.length, 14); assert.equal(d.SPARK.lines.length, 1); assert.equal(dongu, 2);
  assert.ok(Array.from(d.SPARK.ps).every((p) => p.x === 100 && p.y === 100 && p.max >= 26), "parcalar verilen noktadan cikar");
});
test("dublaj serisi: 3, 5, 8, 10 ve 12'de buyuk patlama, digerlerinde kucuk", () => {
  const c = yukle(["matchBig"]);
  assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((n) => c.matchBig(n)), [3, 5, 8, 10, 12]);
});
