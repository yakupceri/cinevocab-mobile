package com.cinevocab.app;

import android.content.Intent;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.PluginHandle;
import ee.forgr.capacitor.social.login.GoogleProvider;
import ee.forgr.capacitor.social.login.ModifiedMainActivityForSocialLoginPlugin;
import ee.forgr.capacitor.social.login.SocialLoginPlugin;

// Google ile giris eklentisi, Google'in acip kapattigi ekrandan donen sonucu bu sinif uzerinden alir.
public class MainActivity extends BridgeActivity implements ModifiedMainActivityForSocialLoginPlugin {

    // "Paylas -> CineVocab": baska uygulamadan gelen metni ShareInbox eklentisine verir.
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(ShareInboxPlugin.class);
        super.onCreate(savedInstanceState);
        ShareInboxPlugin.accept(getIntent());          // uygulama paylasimla acildiysa
    }

    @Override
    protected void onNewIntent(Intent intent) {      // uygulama zaten aciksa
        super.onNewIntent(intent);
        if (ShareInboxPlugin.accept(intent) && getBridge() != null) {
            PluginHandle handle = getBridge().getPlugin("ShareInbox");
            if (handle != null && handle.getInstance() instanceof ShareInboxPlugin) ((ShareInboxPlugin) handle.getInstance()).announce();
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode >= GoogleProvider.REQUEST_AUTHORIZE_GOOGLE_MIN && requestCode < GoogleProvider.REQUEST_AUTHORIZE_GOOGLE_MAX) {
            PluginHandle handle = getBridge().getPlugin("SocialLogin");
            if (handle != null && handle.getInstance() instanceof SocialLoginPlugin) {
                ((SocialLoginPlugin) handle.getInstance()).handleGoogleLoginIntent(requestCode, data);
            }
        }
    }

    // Eklenti, bu sinifin duzenlendigini bu bos metodun varligindan anlar; hic cagrilmaz.
    @Override
    public void IHaveModifiedTheMainActivityForTheUseWithSocialLoginPlugin() {}
}
