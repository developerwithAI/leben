import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { KEYS, getItem, setItem } from '../lib/storage';

const SHOW_EVERY = 3;

let InterstitialAd: any;
let AdEventType: any;
let TestIds: any;
let adsAvailable = false;

try {
  const ads = require('react-native-google-mobile-ads');
  InterstitialAd = ads.InterstitialAd;
  AdEventType = ads.AdEventType;
  TestIds = ads.TestIds;
  adsAvailable = true;
} catch {
  adsAvailable = false;
}

const AD_UNIT_ID = __DEV__
  ? TestIds?.INTERSTITIAL
  : Platform.OS === 'ios'
  ? 'ca-app-pub-3118868459944420/2006457673'
  : 'ca-app-pub-3118868459944420/5431756850';

export function useInterstitialAd() {
  const adRef = useRef<any>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!adsAvailable) return;
    const ad = InterstitialAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });
    adRef.current = ad;
    const unsub = ad.addAdEventListener(AdEventType.LOADED, () => {
      loadedRef.current = true;
    });
    ad.load();
    return () => unsub();
  }, []);

  // Call before navigating to results — shows ad every 3rd exam
  const showIfDue = async (): Promise<void> => {
    const count = (await getItem<number>(KEYS.EXAM_COUNT, 0)) + 1;
    await setItem(KEYS.EXAM_COUNT, count);

    if (count % SHOW_EVERY === 0 && adsAvailable && loadedRef.current && adRef.current) {
      await adRef.current.show();
      loadedRef.current = false;
    }
  };

  return { showIfDue };
}
