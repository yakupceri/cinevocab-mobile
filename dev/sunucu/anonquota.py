"""Hesapsız çeviri kotası: oturum açmamış bir adresin günde YENİ çevirtebileceği kelime sayısı.

Neden: /translate-words hesap istemiyor (eklenti ve mobilin misafir modu böyle çalışıyor). Veritabanında hazır
olan kelimeler bedava ve sınırsız; ama veritabanında olmayan her kelime ücretli çeviri servisine gider.
Bu kota yalnızca o YENİ kelimeleri sayar. Kota dolunca hata verilmez: fazlası "pending" olarak döner,
hazır olan kelimeler dönmeye devam eder. Oturum açmış kullanıcı kotaya girmez.

Gizlilik: adresler yalnızca bellekte tutulur, veritabanına yazılmaz, gün değişince silinir.
Yalnızca standart kütüphane kullanır; veritabanına ve ağa dokunmaz.
"""
import datetime as dt
import os
import threading

LIMIT = int(os.environ.get("ANON_NEW_WORDS_DAY", "400"))    # 0 ya da negatif: kota kapalı
MAX_KEYS = 50000                                            # bellek sınırı: aşılırsa sayaçlar sıfırlanır

_lock = threading.Lock()
_used = {}
_day = [""]


def _today() -> str:
    return dt.datetime.now(dt.timezone.utc).date().isoformat()


def take(key: str, want: int, limit: int = None, day: str = None) -> int:
    """`key` için bugün `want` yeni kelimeden kaçına izin var? İzin verilen kadarını kotadan düşer ve döner."""
    limit = LIMIT if limit is None else limit
    want = max(0, int(want))
    if limit <= 0 or not want:
        return want
    day = day or _today()
    with _lock:
        if _day[0] != day or len(_used) > MAX_KEYS:
            _used.clear()
            _day[0] = day
        used = _used.get(key, 0)
        ok = max(0, min(want, limit - used))
        if ok:
            _used[key] = used + ok
        return ok


def split(key: str, missing: list, signed_in: bool, limit: int = None, day: str = None):
    """Çevrilecek kelimeleri (çevrilecekler, kotaya takılanlar) diye ikiye ayırır. Oturum açmış kullanıcıda hepsi çevrilir."""
    if signed_in or not missing:
        return list(missing), []
    n = take(key, len(missing), limit, day)
    return list(missing[:n]), list(missing[n:])
