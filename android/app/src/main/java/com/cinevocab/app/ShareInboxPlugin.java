package com.cinevocab.app;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.util.Base64;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.Text;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.latin.TextRecognizerOptions;
import java.io.InputStream;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

// Baska bir uygulamadan "Paylas -> CineVocab" ile gelen duz metni tutar ve web tarafina verir.
// Metin yalnizca bellekte durur (diske yazilmaz, sunucuya gonderilmez); web tarafi take() ile bir kez alir.
// Gorsel (ekran goruntusu, altyazi fotografi) gelirse yazi telefonun icinde okunur (ML Kit, cihaz ici);
// gorsel diske kopyalanmaz, sunucuya gonderilmez. Yalnizca ACTION_SEND + text/* ve image/* kabul edilir.
@CapacitorPlugin(name = "ShareInbox")
public class ShareInboxPlugin extends Plugin {
    static final int MAX_TEXT = 400000;     // www/text.js icindeki MAX_CHARS ile ayni
    static final int MAX_SUBJECT = 120;
    private static String text = null;
    private static String subject = null;
    private static Uri image = null;
    static final int MAX_SIDE = 2000;       // buyuk fotograflar okumadan once kucultulur

    // Niyet paylasim ise metni saklar ve true doner. Uygulama acilirken ve aciksa yeni niyet geldiginde cagrilir.
    static boolean accept(Intent intent) {
        if (intent == null || !Intent.ACTION_SEND.equals(intent.getAction())) return false;
        String type = intent.getType();
        if (type != null && type.startsWith("image/")) {
            Uri uri = intent.getParcelableExtra(Intent.EXTRA_STREAM);
            if (uri == null) return false;
            image = uri; text = null; subject = "";
            return true;
        }
        if (type == null || !type.startsWith("text/")) return false;
        CharSequence body = intent.getCharSequenceExtra(Intent.EXTRA_TEXT);
        if (body == null || body.toString().trim().isEmpty()) return false;
        String s = body.toString();
        image = null;
        text = s.length() > MAX_TEXT ? s.substring(0, MAX_TEXT) : s;
        String sub = intent.getStringExtra(Intent.EXTRA_SUBJECT);
        subject = sub == null ? "" : (sub.length() > MAX_SUBJECT ? sub.substring(0, MAX_SUBJECT) : sub);
        return true;
    }

    // Web tarafi: bekleyen paylasimi alir. Bir kez verilir, sonra silinir.
    @PluginMethod
    public void take(PluginCall call) {
        if (image != null) {                 // paylasilan gorsel: yaziyi oku, sonucu metin olarak ver
            Uri uri = image;
            image = null;
            try (InputStream in = getContext().getContentResolver().openInputStream(uri)) {
                read(call, shrink(BitmapFactory.decodeStream(in)));
            } catch (Exception e) {
                call.reject("image");
            }
            return;
        }
        JSObject out = new JSObject();
        out.put("text", text == null ? "" : text);
        out.put("subject", subject == null ? "" : subject);
        text = null;
        subject = null;
        call.resolve(out);
    }

    // Web tarafi: uygulamanin icinden secilen ya da cekilen gorseldeki yaziyi okur. data: base64 (jpeg/png).
    @PluginMethod
    public void ocr(PluginCall call) {
        try {
            byte[] raw = Base64.decode(call.getString("data", ""), Base64.DEFAULT);
            read(call, shrink(BitmapFactory.decodeByteArray(raw, 0, raw.length)));
        } catch (Exception e) {
            call.reject("image");
        }
    }

    private static Bitmap shrink(Bitmap b) {
        if (b == null) return null;
        int side = Math.max(b.getWidth(), b.getHeight());
        if (side <= MAX_SIDE) return b;
        float k = (float) MAX_SIDE / side;
        return Bitmap.createScaledBitmap(b, Math.round(b.getWidth() * k), Math.round(b.getHeight() * k), true);
    }

    // Cihaz ici yazi tanima (Latin harfleri). Satirlar yukaridan asagiya, oldugu gibi doner; ayiklama web tarafinda.
    private void read(PluginCall call, Bitmap bmp) {
        if (bmp == null) { call.reject("image"); return; }
        TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS).process(InputImage.fromBitmap(bmp, 0))
            .addOnSuccessListener(result -> {
                StringBuilder sb = new StringBuilder();
                for (Text.TextBlock block : result.getTextBlocks()) {
                    for (Text.Line line : block.getLines()) sb.append(line.getText()).append('\n');
                }
                JSObject out = new JSObject();
                out.put("text", sb.length() > MAX_TEXT ? sb.substring(0, MAX_TEXT) : sb.toString());
                out.put("subject", "");
                out.put("image", true);
                call.resolve(out);
            })
            .addOnFailureListener(e -> call.reject("ocr"));
    }

    // Uygulama acikken yeni paylasim geldi: web tarafina haber ver (metni olayla gondermez, web take() ile alir).
    void announce() {
        notifyListeners("shared", new JSObject(), true);
    }
}
