// www/app.js tek bir kapali fonksiyon; disari bir sey vermiyor. Testler icin adiyla fonksiyon/sabit kaynagini
// dosyadan alir ve sahte ortamda (store, Date, DOM) calistirir. www/ dosyalarina dokunmaz.
// Aranan ad bulunamazsa hata firlatir: kod degistiyse test sessizce gecmez.
"use strict";
const fs = require("node:fs"), path = require("node:path"), vm = require("node:vm");
const SRC = fs.readFileSync(path.join(__dirname, "..", "..", "www", "app.js"), "utf8");

function kaynak(ad) {
  let m = new RegExp("^ {2}(?:async )?function " + ad + "\\(", "m").exec(SRC), govde = true;
  if (!m) { m = new RegExp("^ {2}(?:const|let) " + ad + " = ", "m").exec(SRC); govde = false; }
  if (!m) throw new Error("www/app.js icinde '" + ad + "' bulunamadi (adi ya da yeri degismis olabilir)");
  if (!govde) return SRC.slice(m.index, SRC.indexOf("\n", m.index));
  let i = SRC.indexOf("{", SRC.indexOf(")", m.index)), n = 0;
  for (; i < SRC.length; i++) { if (SRC[i] === "{") n++; else if (SRC[i] === "}" && --n === 0) break; }
  return SRC.slice(m.index, i + 1);
}

// adlar: app.js'ten alinacaklar. ortam: sahte bagimliliklar. simdi: sabit "su an" (Date nesnesi ya da ISO metni).
function yukle(adlar, ortam, simdi) {
  const an = { t: new Date(simdi || "2026-11-24T12:00:00").getTime() };
  class SahteDate extends Date { constructor(...a) { if (a.length) super(...a); else super(an.t); } static now() { return an.t; } }
  const depo = new Map();
  const ctx = Object.assign({ Date: SahteDate, Math, JSON, Number, String, Array, Intl, Error,
    store: { get: (k) => (depo.has(k) ? depo.get(k) : null), set: (k, v) => depo.set(k, String(v)), del: (k) => depo.delete(k) } }, ortam || {});
  vm.createContext(ctx);
  // const/let ust duzeyde context'e yazilmaz; var'a cevirip disari aciyoruz.
  const kod = adlar.map(kaynak).join("\n").replace(/^ {2}(const|let) /gm, "  var ");
  vm.runInContext(kod, ctx, { filename: "app.js(parca)" });
  ctx.__depo = depo; ctx.__saat = (v) => { an.t = new Date(v).getTime(); };
  return ctx;
}
module.exports = { yukle, kaynak };
