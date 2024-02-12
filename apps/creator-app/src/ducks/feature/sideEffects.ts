import * as Realtime from '@voiceflow/realtime-sdk';

import client from '@/client';
import { Thunk } from '@/store/types';

export const loadFeatures = (): Thunk => async (dispatch) => {
  const features = await client.feature.getStatuses();
  dispatch.local(Realtime.feature.loadAll({ features }));
};
