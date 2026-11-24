# Üçüncü taraf skill'ler

Skill'ler depoda **durmaz**; `.claude/skills/` `.gitignore`'dadır ve yalnızca diskte bulunur. Yeni bir bilgisayarda aşağıdaki komutla yeniden kurulur.

| Skill | Ne işe yarar | Kaynak | Lisans |
|---|---|---|---|
| `capacitor-app-development` | Capacitor yapılandırma, safe-area, güvenlik, sorun giderme | https://github.com/capawesome-team/skills/tree/main/skills/capacitor-app-development | MIT, © 2026 Capawesome |
| `capacitor-plugins` | Eklenti kurulumu ve kullanımı (bildirim, titreşim, paylaşma dahil) | https://github.com/capawesome-team/skills/tree/main/skills/capacitor-plugins | MIT, © 2026 Capawesome |
| `capacitor-app-upgrades` | Capacitor ana sürüm yükseltme adımları | https://github.com/capawesome-team/skills/tree/main/skills/capacitor-app-upgrades | MIT, © 2026 Capawesome |
| `frontend-design` | Tasarım yönü rehberi | Claude Code eklentisi (Anthropic eklenti dizini), bilgisayarda kurulu | Apache-2.0 |

İncelenen commit: `847d536b4b6b`. O commit'te üç klasör de yalnızca Markdown'dı: hook, `allowed-tools`, çalıştırılabilir dosya, sembolik bağ yok.

## Yeniden kurulum (proje kökünden)

```sh
git clone https://github.com/capawesome-team/skills /tmp/cap-skills
git -C /tmp/cap-skills checkout 847d536b4b6b
mkdir -p .claude/skills
for s in capacitor-app-development capacitor-plugins capacitor-app-upgrades; do cp -R /tmp/cap-skills/skills/$s .claude/skills/; done
cp /tmp/cap-skills/LICENSE .claude/skills/LICENSE-capawesome-MIT.txt
```

Daha yeni bir commit alınacaksa önce içine bakılır (hook, betik, MCP kurulumu var mı). `frontend-design` için: Claude Code içinde `/plugin` menüsünden `frontend-design` eklentisi.

## Kurulmayanlar
- `capacitor-mcp`, `capawesome-mcp`, `ionic-framework-mcp`: arka planda çalışan MCP sunucusu kurduruyor.
- `capawesome-cloud`, `capawesome-cli`, `capgo-cloud-migration`, `ionic-appflow-migration`: ücretli bulut hizmeti, kullanmıyoruz.
- `capacitor-push-notifications`: Firebase ister; biz yalnızca yerel bildirim kullanıyoruz.
- `capacitor-in-app-purchases`: uygulamada satış yok.
- `ionic-*`, `capacitor-angular/react/vue`: uygulama düz JS.
- Eklenti geliştirme ve iOS SPM skill'leri: kapsam dışı.

## Uygulamaya giren kütüphaneler
| Kütüphane | Ne işe yarar | Kaynak | Lisans / koşul |
|---|---|---|---|
| `com.google.mlkit:text-recognition:16.0.1` | Fotoğraf ve ekran görüntüsündeki altyazıyı telefonda okur (Latin harfleri) | Google Maven, `android/app/build.gradle` | Açık kaynak değil; Google ML Kit kullanım koşulları. Google'a tanılama verisi yollar: `store/PLAY-STORE.md` veri güvenliği bölümüne bak. Cihaz başına yaklaşık 10 MB ekler |
| Big Shoulders Display, Instrument Sans | Yazı tipleri | Google Fonts, `www/fonts/` | SIL OFL 1.1 |

## Bu projeye ait olanlar
`agents/`, `commands/`, `ofis/` bu proje için yazıldı (cinevocab-app'teki sürümlerden uyarlandı). `ofis/hook.py` yalnızca standart kütüphane kullanır, `ofis/durum.json` dosyasına yazar, ağa çıkmaz.
