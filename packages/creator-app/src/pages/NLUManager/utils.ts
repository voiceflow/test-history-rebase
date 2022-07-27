import * as Realtime from '@voiceflow/realtime-sdk';

export const createIntentsSorter =
  (defaultIntentCount = 100000) =>
  (intentL: Realtime.Intent, intentR: Realtime.Intent) => {
    const intentLStrength = intentL.inputs.length || defaultIntentCount;
    const intentRStrength = intentR.inputs.length || defaultIntentCount;

    if (intentLStrength < intentRStrength) return -1;
    if (intentLStrength > intentRStrength) return 1;

    return 0;
  };
