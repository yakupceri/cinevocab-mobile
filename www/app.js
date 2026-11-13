/* CineVocab mobil uygulama mantigi. Sunucu: sitenin ve eklentinin kullandigi ayni API.
   Bolumler: ayarlar, ceviri metinleri, API yardimcisi, giris, video, kelimeler, pratik, ben, sekmeler. */
(function () {
  "use strict";
  const API = "https://cinevocab.up.railway.app";
  const LANGS = ["en", "tr", "de", "fr", "es", "it", "pt", "ru", "ar", "ro", "ja", "hi", "id", "pl", "nl", "ko"];
  const $ = (id) => document.getElementById(id);

  // Telefonda kalici kucuk kayitlar (oturum anahtari, dil secimi).
  const store = {
    get(k) { try { return localStorage.getItem("cv-" + k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem("cv-" + k, v); } catch (e) {} },
    del(k) { try { localStorage.removeItem("cv-" + k); } catch (e) {} },
  };

  const sys = String(navigator.language || "en").toLowerCase().split("-")[0];
  const S = {
    key: store.get("key") || "",
    ui: store.get("ui") || (sys === "tr" ? "tr" : "en"),
    // Varsayilan: Ingilizce video izleyip kendi diline ceviren biri.
    src: store.get("src") || (sys === "en" ? "es" : "en"),
    dst: store.get("dst") || (LANGS.includes(sys) ? sys : "en"),
    vocab: null,      // /api/vocab cevabi (dil cifti degisince sifirlanir)
  };

  // ---------------------------------------------------------------- ceviri metinleri
  const T = {
    en: {
      authH: "Your words, from every video", authSub: "Log in to save the words you collect.",
      login: "Log in", register: "Sign up", username: "Username", email: "Email", password: "Password",
      loginGo: "Log in", regGo: "Create account", verify: "Verify", back: "Back",
      codeSub: "We sent a 6-digit code to {0}. Enter it to create your account.",
      recText: "Your recovery code. Keep it somewhere safe: it is the only way back in if you forget your password.",
      recOk: "I saved it", eFill: "Fill in every field.",
      videoH: "Words from a video", videoSub: "Paste a YouTube link and we add the new words to your list.",
      srcLbl: "Video language", dstLbl: "Translate to", swap: "Swap languages",
      linkLbl: "YouTube link", countLbl: "How many new words?", extract: "Get the words",
      eLink: "That does not look like a YouTube link.", eSame: "The two languages must differ.",
      reading: "Reading the subtitles…", planning: "Picking your new words…",
      eNotracks: "This video has no subtitles.", eLang: "This video has no {0} subtitles. Available: {1}",
      eEmpty: "The subtitles could not be read.", eFail: "Could not reach YouTube. Check your connection and try again.",
      planSum: "{0} different words in this video. You have already seen {1}. {2} are new.",
      planNone: "No new words for you in this video. You have already seen all {0}.",
      tapRemove: "Tap a word to leave it out.", addN: "Add {0} words to my list", adding: "Translating and saving… {0}/{1}",
      added: "{0} words added to your list.", eAdd: "Saving stopped: {0}", seeWords: "See my words", autoSub: "auto-generated subtitles",
      wordsH: "My words", wordsSub: "{0} words · {1} → {2}", search: "Search words…", more: "Show more",
      wEmpty: "No words yet. Add some from a video.", wNoMatch: "No words match.", know: "I know it", markedKnown: "Marked as known",
      pracH: "Practice", pracSub: "A short quiz from your own words.", due: "Due today", newW: "New", mastered: "Mastered",
      start: "Start", again: "Again", pNeed: "You need at least 4 words to practice. Add some from a video.",
      qCount: "{0} / {1}", score: "{0} / {1}", xpGain: "+{0} XP", level: "Level {0}",
      streak: "Day streak", wordsN: "Words", appLang: "App language",
      siteText: "Duels, leagues and the Chrome extension live on the website.", openSite: "Open the website", logout: "Log out",
      tabVideo: "Video", tabWords: "Words", tabPractice: "Practice", tabMe: "Me",
      eNet: "No connection. Try again.", eSession: "Your session ended. Log in again.",
    },
    tr: {
      authH: "Her videodan, senin kelimelerin", authSub: "Topladığın kelimeleri kaydetmek için giriş yap.",
      login: "Giriş yap", register: "Kayıt ol", username: "Kullanıcı adı", email: "E-posta", password: "Parola",
      loginGo: "Giriş yap", regGo: "Hesap oluştur", verify: "Doğrula", back: "Geri",
      codeSub: "{0} adresine 6 haneli bir kod gönderdik. Hesabını açmak için kodu gir.",
      recText: "Kurtarma kodun. Güvenli bir yere kaydet: parolanı unutursan hesabına dönmenin tek yolu bu.",
      recOk: "Kaydettim", eFill: "Bütün alanları doldur.",
      videoH: "Videodan kelime çıkar", videoSub: "YouTube linkini yapıştır, yeni kelimeleri listene ekleyelim.",
      srcLbl: "Video şu dilde", dstLbl: "Çeviriler şu dilde", swap: "Dilleri değiştir",
      linkLbl: "YouTube linki", countLbl: "Kaç yeni kelime?", extract: "Kelimeleri çıkar",
      eLink: "Bu bir YouTube linki gibi görünmüyor.", eSame: "İki dil farklı olmalı.",
      reading: "Altyazı okunuyor…", planning: "Yeni kelimelerin seçiliyor…",
      eNotracks: "Bu videoda altyazı yok.", eLang: "Bu videoda {0} altyazı yok. Olan diller: {1}",
      eEmpty: "Altyazı okunamadı.", eFail: "YouTube'a ulaşılamadı. Bağlantını kontrol edip tekrar dene.",
      planSum: "Bu videoda {0} farklı kelime var. {1} tanesini daha önce gördün. {2} tanesi yeni.",
      planNone: "Bu videoda senin için yeni kelime yok. {0} kelimenin hepsini daha önce gördün.",
      tapRemove: "Eklemek istemediğin kelimeye dokun.", addN: "{0} kelimeyi listeme ekle", adding: "Çevriliyor ve kaydediliyor… {0}/{1}",
      added: "{0} kelime listene eklendi.", eAdd: "Kaydetme durdu: {0}", seeWords: "Kelimelerimi gör", autoSub: "otomatik altyazı",
      wordsH: "Kelimelerim", wordsSub: "{0} kelime · {1} → {2}", search: "Kelime ara…", more: "Daha fazla göster",
      wEmpty: "Henüz kelime yok. Bir videodan ekle.", wNoMatch: "Eşleşen kelime yok.", know: "Biliyorum", markedKnown: "Biliyorum olarak işaretlendi",
      pracH: "Pratik", pracSub: "Kendi kelimelerinden kısa bir test.", due: "Bugün tekrar", newW: "Yeni", mastered: "Öğrenildi",
      start: "Başla", again: "Tekrar", pNeed: "Pratik için en az 4 kelime lazım. Bir videodan ekle.",
      qCount: "{0} / {1}", score: "{0} / {1}", xpGain: "+{0} XP", level: "Seviye {0}",
      streak: "Günlük seri", wordsN: "Kelime", appLang: "Uygulama dili",
      siteText: "Düello, ligler ve Chrome eklentisi web sitesinde.", openSite: "Web sitesini aç", logout: "Çıkış yap",
      tabVideo: "Video", tabWords: "Kelimeler", tabPractice: "Pratik", tabMe: "Ben",
      eNet: "Bağlantı yok. Tekrar dene.", eSession: "Oturumun sona erdi. Tekrar giriş yap.",
    },
  };
  function t(key) {
    let s = (T[S.ui] && T[S.ui][key]) || T.en[key] || key;
    for (let i = 1; i < arguments.length; i++) s = s.split("{" + (i - 1) + "}").join(arguments[i]);
    return s;
  }
  // Dil adini uygulama dilinde yazar (en -> "English" / "İngilizce").
  function langName(code) {
    try {
      const n = new Intl.DisplayNames([S.ui], { type: "language" }).of(code);
      return n.charAt(0).toLocaleUpperCase(S.ui) + n.slice(1);
    } catch (e) { return code.toUpperCase(); }
  }
  function applyTexts() {
    document.documentElement.lang = S.ui;
    document.querySelectorAll("[data-i]").forEach((n) => { n.textContent = t(n.getAttribute("data-i")); });
    document.querySelectorAll("[data-i-ph]").forEach((n) => { n.placeholder = t(n.getAttribute("data-i-ph")); });
    document.querySelectorAll("[data-i-aria]").forEach((n) => { n.setAttribute("aria-label", t(n.getAttribute("data-i-aria"))); });
    for (const id of ["src", "dst"]) {
      const sel = $(id), cur = id === "src" ? S.src : S.dst;
      sel.textContent = "";
      for (const code of LANGS) sel.add(new Option(langName(code), code));
      sel.value = cur;
    }
    $("uiLang").value = S.ui;
    setAuthMode(authMode);
  }

  function say(el, text, kind) { el.textContent = text || ""; el.className = "note" + (kind ? " " + kind : ""); }
  let toastTimer = 0;
  function toast(text) {
    $("toast").textContent = text; $("toast").hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { $("toast").hidden = true; }, 2200);
  }

  // ---------------------------------------------------------------- API yardimcisi
  // Butun sunucu istekleri buradan gecer: oturum anahtarini ekler, hatayi okunur mesaja cevirir.
  async function api(path, opt) {
    opt = opt || {};
    const headers = {};
    if (opt.body) headers["Content-Type"] = "application/json";
    if (S.key) headers.Authorization = "Bearer " + S.key;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), opt.timeout || 20000);
    let r;
    try {
      r = await fetch(API + path, { method: opt.body ? "POST" : "GET", headers: headers,
                                    body: opt.body ? JSON.stringify(opt.body) : undefined, signal: ctrl.signal });
    } catch (e) { throw new Error(t("eNet")); }
    finally { clearTimeout(timer); }
    let d = null;
    try { d = await r.json(); } catch (e) {}
    if (r.status === 401 && S.key) { endSession(); throw new Error(t("eSession")); }
    if (!r.ok) throw new Error((d && typeof d.detail === "string" && d.detail) || "HTTP " + r.status);
    return d;
  }
  const pairQ = () => "?src=" + S.src + "&dst=" + S.dst;

  // ---------------------------------------------------------------- giris / kayit
  let authMode = "login", mailOn = false, pendingKey = "";
  function setAuthMode(m) {
    authMode = m;
    $("segLogin").setAttribute("aria-pressed", m === "login");
    $("segReg").setAttribute("aria-pressed", m === "register");
    $("aMailRow").hidden = !(m === "register" && mailOn);
    $("aPass").autocomplete = m === "login" ? "current-password" : "new-password";
    $("aGo").textContent = t(m === "login" ? "loginGo" : "regGo");
  }
  function showAuthStep(step) {      // "form" | "code" | "rec"
    $("authSeg").hidden = step !== "form";
    $("authForm").hidden = step !== "form";
    $("codeForm").hidden = step !== "code";
    $("recBox").hidden = step !== "rec";
    say($("aMsg"), "");
  }
  function startSession(key) {
    S.key = key; store.set("key", key);
    $("aPass").value = ""; $("aCode").value = "";
    showAuthStep("form");
    enterApp();
  }
  function endSession() {
    S.key = ""; S.vocab = null; store.del("key");
    $("streak").hidden = true;
    showView("v-auth");
  }
  // Kayit bitince sunucu bir kurtarma kodu verir; kullaniciya bir kez gosterilir.
  function afterRegister(d) {
    if (d.recovery) { pendingKey = d.key; $("recCode").textContent = d.recovery; showAuthStep("rec"); }
    else startSession(d.key);
  }
  $("segLogin").addEventListener("click", () => setAuthMode("login"));
  $("segReg").addEventListener("click", () => setAuthMode("register"));
  $("authForm").addEventListener("submit", async function (ev) {
    ev.preventDefault();
    const username = $("aUser").value.trim(), password = $("aPass").value, email = $("aMail").value.trim();
    if (!username || !password || (authMode === "register" && mailOn && !email)) return say($("aMsg"), t("eFill"), "bad");
    $("aGo").disabled = true; say($("aMsg"), "");
    try {
      if (authMode === "login") {
        startSession((await api("/api/ext/login", { body: { username: username, password: password } })).key);
      } else if (mailOn) {
        await api("/api/signup/start", { body: { username: username, email: email, password: password, lang: S.ui } });
        $("codeSub").textContent = t("codeSub", email);
        showAuthStep("code"); $("aCode").focus();
      } else {
        afterRegister(await api("/api/ext/register", { body: { username: username, password: password } }));
      }
    } catch (e) { say($("aMsg"), e.message, "bad"); }
    $("aGo").disabled = false;
  });
  $("codeForm").addEventListener("submit", async function (ev) {
    ev.preventDefault();
    try {
      afterRegister(await api("/api/signup/verify", { body: { email: $("aMail").value.trim(), code: $("aCode").value.trim(), ext: true } }));
    } catch (e) { say($("aMsg"), e.message, "bad"); }
  });
  $("codeBack").addEventListener("click", () => showAuthStep("form"));
  $("recOk").addEventListener("click", () => { const k = pendingKey; pendingKey = ""; startSession(k); });

  // ---------------------------------------------------------------- dil cifti
  function setPair(src, dst) {
    S.src = src; S.dst = dst; S.vocab = null;
    store.set("src", src); store.set("dst", dst);
    $("src").value = src; $("dst").value = dst;
    $("plan").hidden = true;
  }
  $("src").addEventListener("change", () => setPair($("src").value, S.dst));
  $("dst").addEventListener("change", () => setPair(S.src, $("dst").value));
  $("swap").addEventListener("click", () => setPair(S.dst, S.src));

  // ---------------------------------------------------------------- video: altyazidan kelime cikar
  let plan = null;     // { title, thumb, words: [secilen kelimeler] }
  $("go").addEventListener("click", async function () {
    const msg = $("msg");
    if (!CVYT.videoId($("link").value.trim())) return say(msg, t("eLink"), "bad");
    if (S.src === S.dst) return say(msg, t("eSame"), "bad");
    $("go").disabled = true; $("plan").hidden = true;
    try {
      say(msg, t("reading"));
      const tr = await CVYT.readTranscript($("link").value.trim(), S.src);   // 1) altyaziyi telefondan oku
      if (!tr.ok) {
        const text = tr.err === "lang" ? t("eLang", langName(S.src), (tr.have || []).map(langName).join(", "))
          : t({ novideo: "eLink", notracks: "eNotracks", empty: "eEmpty" }[tr.err] || "eFail");
        say(msg, text, "bad");
      } else {
        say(msg, t("planning"));
        const p = await api("/api/import/plan", { body: { src: S.src, dst: S.dst, words: tr.words, n: Number($("count").value) } });  // 2) yeni kelimeleri sunucu secer
        say(msg, "");
        showPlan(tr, p);
      }
    } catch (e) { say(msg, e.message, "bad"); }
    $("go").disabled = false;
  });

  function showPlan(tr, p) {
    plan = { title: tr.title, thumb: tr.thumb, words: p.pick.slice() };
    $("planTitle").textContent = tr.title + (tr.auto ? " (" + t("autoSub") + ")" : "");
    const box = $("planWords"); box.textContent = "";
    const none = !p.pick.length;
    $("planSum").textContent = none ? t("planNone", p.total) : t("planSum", p.total, p.known + p.saved, p.fresh);
    for (const w of p.pick) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = w; b.setAttribute("aria-pressed", "true");
      b.addEventListener("click", function () {      // dokununca kelimeyi listeden cikar / geri al
        const on = b.getAttribute("aria-pressed") !== "true";
        b.setAttribute("aria-pressed", on);
        plan.words = on ? plan.words.concat(w) : plan.words.filter((x) => x !== w);
        updateAddBtn();
      });
      box.appendChild(b);
    }
    document.querySelector('#plan [data-i="tapRemove"]').hidden = none;
    $("addBtn").hidden = none; $("addBtn").disabled = false; $("addBtn").dataset.done = "";
    $("addBar").hidden = true; say($("addMsg"), "");
    updateAddBtn();
    $("plan").hidden = false;
    $("plan").scrollIntoView({ block: "nearest" });
  }
  function updateAddBtn() {
    $("addBtn").textContent = t("addN", plan.words.length);
    $("addBtn").disabled = !plan.words.length;
  }
  // 3) Secilen kelimeleri 30'ar 30'ar cevirtip hesaba kaydeder (eklentinin kullandigi ayni uc nokta).
  $("addBtn").addEventListener("click", async function () {
    if ($("addBtn").dataset.done) { openTab("v-words"); return; }
    const words = plan.words.slice(), total = words.length;
    let done = 0;
    $("addBtn").disabled = true; $("addBar").hidden = false; $("addFill").style.width = "0";
    document.querySelectorAll("#planWords .chip").forEach((c) => { c.disabled = true; });
    try {
      for (let i = 0; i < total; i += 30) {
        say($("addMsg"), t("adding", done, total));
        await api("/translate-words", { timeout: 45000, body: { words: words.slice(i, i + 30), src: S.src, dst: S.dst, gen: 0,
          lookup_only: false, sentence: "", episode: plan.title, thumb: plan.thumb } });
        done = Math.min(i + 30, total);
        $("addFill").style.width = Math.round(done / total * 100) + "%";
      }
      S.vocab = null;
      say($("addMsg"), t("added", total), "ok");
      $("addBtn").textContent = t("seeWords"); $("addBtn").dataset.done = "1";
    } catch (e) {
      if (done) S.vocab = null;
      say($("addMsg"), t("eAdd", e.message), "bad");
    }
    $("addBtn").disabled = false;
  });

  // ---------------------------------------------------------------- kelimeler
  const PAGE = 100;
  let shown = PAGE;
  async function loadVocab() {
    if (!S.vocab) {
      const d = await api("/api/vocab" + pairQ());
      const seen = new Set(), list = [];
      for (const w of d.words) { if (!seen.has(w.tr)) { seen.add(w.tr); list.push({ w: w.tr, t: w.eng, ep: w.episode || "" }); } }
      S.vocab = list;
    }
    return S.vocab;
  }
  async function showWords() {
    $("wordsSub").textContent = ""; $("wEmpty").hidden = true;
    try { await loadVocab(); } catch (e) { $("wl").textContent = ""; $("wEmpty").textContent = e.message; $("wEmpty").hidden = false; return; }
    shown = PAGE; renderWords();
  }
  function renderWords() {
    const all = S.vocab || [], qv = $("wq").value.trim().toLowerCase();
    const list = qv ? all.filter((x) => x.w.toLowerCase().includes(qv) || String(x.t).toLowerCase().includes(qv)) : all;
    $("wordsSub").textContent = t("wordsSub", all.length, langName(S.src), langName(S.dst));
    const ul = $("wl"); ul.textContent = "";
    for (const x of list.slice(0, shown)) {
      const li = document.createElement("li"), box = document.createElement("div"), b = document.createElement("b"),
            sp = document.createElement("span"), k = document.createElement("button");
      box.className = "w"; b.textContent = x.w; sp.textContent = x.t; box.append(b, sp);
      k.type = "button"; k.textContent = t("know");
      k.addEventListener("click", async function () {
        k.disabled = true;
        try {
          await api("/api/known", { body: { src: S.src, words: [x.w], known: true } });
          S.vocab = S.vocab.filter((y) => y !== x); renderWords(); toast(t("markedKnown"));
        } catch (e) { k.disabled = false; toast(e.message); }
      });
      li.append(box, k); ul.appendChild(li);
    }
    $("wMore").hidden = list.length <= shown;
    $("wEmpty").textContent = all.length ? t("wNoMatch") : t("wEmpty");
    $("wEmpty").hidden = list.length > 0;
  }
  $("wq").addEventListener("input", () => { shown = PAGE; renderWords(); });
  $("wMore").addEventListener("click", () => { shown += PAGE; renderWords(); });

  // ---------------------------------------------------------------- pratik (coktan secmeli)
  let quiz = null;     // { items:[{w, t}], i, results:[{w, ok}] }
  function showPractice(part) {
    $("pIntro").hidden = part !== "intro"; $("pQuiz").hidden = part !== "quiz"; $("pDone").hidden = part !== "done";
  }
  async function loadPractice() {
    showPractice("intro"); say($("pMsg"), "");
    try {
      const d = await api("/api/srs" + pairQ());
      $("pDue").textContent = d.due; $("pNew").textContent = d.new; $("pMast").textContent = d.mastered;
    } catch (e) { say($("pMsg"), e.message, "bad"); }
  }
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  async function startQuiz() {
    $("pStart").disabled = true; say($("pMsg"), "");
    try {
      const d = await api("/api/srs/session" + pairQ() + "&n=10");
      const all = await loadVocab();
      if (d.words.length < 4) say($("pMsg"), t("pNeed"), "bad");
      else {
        quiz = { items: d.words.map((x) => ({ w: x.tr, t: x.eng })), i: 0, results: [],
                 pool: Array.from(new Set(all.map((x) => x.t).concat(d.words.map((x) => x.eng)))) };
        showPractice("quiz"); nextQuestion();
      }
    } catch (e) { say($("pMsg"), e.message, "bad"); }
    $("pStart").disabled = false;
  }
  function nextQuestion() {
    const it = quiz.items[quiz.i], n = quiz.items.length;
    $("pFill").style.width = Math.round(quiz.i / n * 100) + "%";
    $("pCount").textContent = t("qCount", quiz.i + 1, n);
    $("pWord").textContent = it.w;
    const wrong = shuffle(quiz.pool.filter((x) => x !== it.t)).slice(0, 3);
    const box = $("pOpts"); box.textContent = "";
    for (const text of shuffle(wrong.concat(it.t))) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "opt"; b.textContent = text;
      b.addEventListener("click", function () {
        const ok = text === it.t;
        box.querySelectorAll("button").forEach((x) => { x.disabled = true; if (x.textContent === it.t) x.classList.add("right"); });
        if (!ok) b.classList.add("wrong");
        quiz.results.push({ w: it.w, ok: ok });
        setTimeout(function () { quiz.i++; if (quiz.i < n) nextQuestion(); else finishQuiz(); }, ok ? 650 : 1500);
      });
      box.appendChild(b);
    }
  }
  async function finishQuiz() {
    const right = quiz.results.filter((r) => r.ok).length;
    $("pScore").textContent = t("score", right, quiz.results.length);
    $("pXp").textContent = "";
    showPractice("done");
    try {
      const d = await api("/api/srs/report", { body: { src: S.src, dst: S.dst, items: quiz.results } });
      if (d && d.xp) $("pXp").textContent = t("xpGain", d.xp);
      loadHeader();
    } catch (e) { $("pXp").textContent = e.message; }
  }
  $("pStart").addEventListener("click", startQuiz);
  $("pAgain").addEventListener("click", loadPractice);

  // ---------------------------------------------------------------- ben + ust cubuk
  let home = null;
  async function loadHeader() {
    try {
      home = await api("/api/ext/home" + pairQ());
      $("streakN").textContent = home.streak; $("streak").hidden = false;
      if (!$("v-me").hidden) showMe();
    } catch (e) {}
  }
  function showMe() {
    if (!home) return;
    $("meName").textContent = home.username;
    $("meLevel").textContent = t("level", home.level);
    $("meStreak").textContent = home.streak; $("meWords").textContent = home.words; $("meXp").textContent = home.xp;
  }
  $("uiLang").addEventListener("change", function () {
    S.ui = $("uiLang").value; store.set("ui", S.ui);
    applyTexts(); showMe();
  });
  $("logout").addEventListener("click", async function () {
    try { await api("/api/ext/logout", { body: {} }); } catch (e) {}
    endSession();
  });

  // ---------------------------------------------------------------- sekmeler
  function showView(id) {
    document.querySelectorAll("main section").forEach((s) => { s.hidden = s.id !== id; });
    $("tabs").hidden = id === "v-auth";
    document.querySelectorAll("#tabs button").forEach((b) => {
      if (b.dataset.view === id) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    });
    document.querySelector("main").scrollTop = 0;
  }
  function openTab(id) {
    showView(id);
    if (id === "v-words") showWords();
    if (id === "v-practice") loadPractice();
    if (id === "v-me") { showMe(); loadHeader(); }
  }
  document.querySelectorAll("#tabs button").forEach((b) => b.addEventListener("click", () => openTab(b.dataset.view)));

  function enterApp() { openTab("v-video"); loadHeader(); }

  // ---------------------------------------------------------------- acilis
  applyTexts();
  if (S.key) enterApp(); else showView("v-auth");
  // Sunucuda e-posta dogrulamasi acik mi? Aciksa kayit formunda e-posta alani cikar.
  fetch(API + "/api/ext/config").then((r) => r.json()).then((c) => { mailOn = !!(c && c.mail); setAuthMode(authMode); }).catch(() => {});
})();
