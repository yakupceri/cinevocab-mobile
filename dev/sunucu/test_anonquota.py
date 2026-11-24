"""anonquota testleri. Çalıştır: python3 -m pytest dev/tests/py/test_anonquota.py -q  (ya da: python3 test_anonquota.py)"""
import anonquota as a


def setup_function(_=None):
    a._used.clear()
    a._day[0] = ""


def test_kota_dolana_kadar_verir_sonra_keser():
    setup_function()
    assert a.take("ip1", 30, limit=50, day="2026-11-25") == 30
    assert a.take("ip1", 30, limit=50, day="2026-11-25") == 20
    assert a.take("ip1", 5, limit=50, day="2026-11-25") == 0
    assert a.take("ip2", 5, limit=50, day="2026-11-25") == 5      # başka adres etkilenmez


def test_gun_degisince_sifirlanir():
    setup_function()
    assert a.take("ip1", 50, limit=50, day="2026-11-25") == 50
    assert a.take("ip1", 10, limit=50, day="2026-11-26") == 10


def test_kota_kapaliysa_ve_sifir_istekte_dokunmaz():
    setup_function()
    assert a.take("ip1", 999, limit=0, day="2026-11-25") == 999
    assert a.take("ip1", 0, limit=50, day="2026-11-25") == 0
    assert a.take("ip1", -3, limit=50, day="2026-11-25") == 0


def test_split_oturumlu_kullanici_kotaya_girmez():
    setup_function()
    kelimeler = ["w%d" % i for i in range(40)]
    assert a.split("ip1", kelimeler, True, limit=10, day="2026-11-25") == (kelimeler, [])
    cevir, kalan = a.split("ip1", kelimeler, False, limit=10, day="2026-11-25")
    assert cevir == kelimeler[:10] and kalan == kelimeler[10:]
    assert a.split("ip1", kelimeler, False, limit=10, day="2026-11-25") == ([], kelimeler)
    assert a.split("ip1", [], False, limit=10, day="2026-11-25") == ([], [])


if __name__ == "__main__":
    for ad, f in list(globals().items()):
        if ad.startswith("test_"):
            f()
            print("gecti:", ad)
