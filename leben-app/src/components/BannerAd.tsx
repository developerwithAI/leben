import React from 'react';
import { Platform, View, Text } from 'react-native';

let GoogleBannerAd: any;
let BannerAdSize: any;
let TestIds: any;
let adsAvailable = false;

try {
  const ads = require('react-native-google-mobile-ads');
  GoogleBannerAd = ads.BannerAd;
  BannerAdSize = ads.BannerAdSize;
  TestIds = ads.TestIds;
  adsAvailable = true;
} catch {
  adsAvailable = false;
}

const AD_UNIT_ID = __DEV__
  ? TestIds?.ADAPTIVE_BANNER
  : Platform.OS === 'ios'
  ? 'ca-app-pub-3118868459944420/1237065824'
  : 'ca-app-pub-3118868459944420/5108253416';

export function BannerAd() {
  if (!adsAvailable) {
    if (!__DEV__) return <View />;
    return (
      <View style={{ height: 50, backgroundColor: '#e8e8e8', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#999', fontSize: 11 }}>[ Werbung ]</Text>
      </View>
    );
  }
  return (
    <View>
      <GoogleBannerAd
        unitId={AD_UNIT_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}
