package com.cinevocab.app;

import android.content.Intent;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

// Baska bir uygulamadan "Paylas -> CineVocab" ile gelen duz metni tutar ve web tarafina verir.
// Metin yalnizca bellekte durur (diske yazilmaz, sunucuya gonderilmez); web tarafi take() ile bir kez alir.
// Yalnizca ACTION_SEND + text/* kabul edilir; dosya ve gorsel alinmaz.
@CapacitorPlugin(name = "ShareInbox")
public class ShareInboxPlugin extends Plugin {
    static final int MAX_TEXT = 400000;     // www/text.js icindeki MAX_CHARS ile ayni
    static final int MAX_SUBJECT = 120;
    private static String text = null;
    private static String subject = null;

    // Niyet paylasim ise metni saklar ve true doner. Uygulama acilirken ve aciksa yeni niyet geldiginde cagrilir.
    static boolean accept(Intent intent) {
        if (intent == null || !Intent.ACTION_SEND.equals(intent.getAction())) return false;
        String type = intent.getType();
        if (type == null || !type.startsWith("text/")) return false;
        CharSequence body = intent.getCharSequenceExtra(Intent.EXTRA_TEXT);
        if (body == null || body.toString().trim().isEmpty()) return false;
        String s = body.toString();
        text = s.length() > MAX_TEXT ? s.substring(0, MAX_TEXT) : s;
        String sub = intent.getStringExtra(Intent.EXTRA_SUBJECT);
        subject = sub == null ? "" : (sub.length() > MAX_SUBJECT ? sub.substring(0, MAX_SUBJECT) : sub);
        return true;
    }

    // Web tarafi: bekleyen paylasimi alir. Bir kez verilir, sonra silinir.
    @PluginMethod
    public void take(PluginCall call) {
        JSObject out = new JSObject();
        out.put("text", text == null ? "" : text);
        out.put("subject", subject == null ? "" : subject);
        text = null;
        subject = null;
        call.resolve(out);
    }

    // Uygulama acikken yeni paylasim geldi: web tarafina haber ver (metni olayla gondermez, web take() ile alir).
    void announce() {
        notifyListeners("shared", new JSObject(), true);
    }
}
