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
  const c = yukle(["run", "combo"], { sfx: (k) => sesler.push(k) });
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
