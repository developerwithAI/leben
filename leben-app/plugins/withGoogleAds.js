const { withAndroidManifest } = require('@expo/config-plugins');

const ANDROID_APP_ID = 'ca-app-pub-3118868459944420~7123817329';

module.exports = (config) =>
  withAndroidManifest(config, (config) => {
    const app = config.modResults.manifest.application[0];
    if (!app['meta-data']) app['meta-data'] = [];
    const existing = app['meta-data'].findIndex(
      (m) => m.$['android:name'] === 'com.google.android.gms.ads.APPLICATION_ID'
    );
    const entry = { $: { 'android:name': 'com.google.android.gms.ads.APPLICATION_ID', 'android:value': ANDROID_APP_ID } };
    if (existing >= 0) app['meta-data'][existing] = entry;
    else app['meta-data'].push(entry);
    return config;
  });
