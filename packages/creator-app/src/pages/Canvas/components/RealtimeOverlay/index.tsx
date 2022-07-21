import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { useFeature } from '@/hooks';

import { CursorOverlay, CursorOverlayV2 } from './components';

const RealtimeOverlay = () => {
  const atomicActionsAwareness = useFeature(Realtime.FeatureFlag.ATOMIC_ACTIONS_AWARENESS);

  return <>{atomicActionsAwareness.isEnabled ? <CursorOverlayV2 /> : <CursorOverlay />}</>;
};

export default RealtimeOverlay;
