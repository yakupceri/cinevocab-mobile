---
description: Karışık bir mesajı net bir göreve ve düzgün bir prompt'a çevirir (önce onay ister, sonra yapar)
argument-hint: <karışık mesajın>
---

Aşağıdaki mesaj kullanıcının dağınık yazdığı bir istek. Hemen uygulama. Önce netleştir.

Mesaj:
$ARGUMENTS

Şunları yap:
1. **Ne istiyor:** tek cümleyle asıl görev.
2. **Net görev listesi:** numaralı, her madde tek eylem. Görevle ilgisi olmayanları "kapsam dışı" satırına koy.
3. **Eksik ya da çelişen yerler:** en fazla 3 kısa soru. Sormadan cevaplanabilecek şeyi sorma; makul varsayılanı yaz ve işaretle.
4. **Düzgün prompt:** netleşmiş görev, bağlam (hangi dosyalar: `www/`, `android/`, `dev/`; hangi kısıtlar: Android izni, yeni paket, sunucu, dil) ve "bitti sayılır" ölçüsünü içeren, kopyalanabilir tek prompt.
5. **Riskler:** yeni Android izni ya da paket gerekiyor mu? Sunucu (başka repo) değişmeli mi? `versionCode` artmalı mı? Telefonda denenmeden bilinemeyecek bir şey var mı? Açıkça yaz.

Sonunda dur ve sor: "Bu şekilde başlayayım mı?" Ben "tamam" demeden dosya yazma, komut çalıştırma, kurma.
Türkçe, kısa ve samimi yaz.
