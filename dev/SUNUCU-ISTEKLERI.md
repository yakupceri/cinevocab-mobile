# Sunucudan istenecekler (mobil tasarım için)

Mobil uygulama bu verileri şu an sunucudan alamıyor. Sunucu başka repoda (`cinevocab-app`); buradan yazılmaz.
Gelene kadar uygulama bu satırları göstermez, uydurmaz.

| # | Uç nokta | İstenen | Nerede kullanılacak |
|---|---|---|---|
| 1 | `GET /api/ext/home` | `week`: son 7 günün her biri için o gün tekrar edilen kelime sayısı (kullanıcının yerel gününe göre) | Ana ekran film şeridi: karede onay işareti yerine sayı |
| 2 | `GET /api/ext/home` | `due_words`: bugün tekrar edilecek ilk 3 kelime | Ana ekran karesindeki altyazı. Şimdi listenin ilk 3 kelimesi gösteriliyor, bugünün tekrarı olduğu iddia edilmiyor |
