import React from 'react';

import { FeatureFlag } from '@/config/features';
import { useFeature } from '@/hooks';

import { CursorOverlay, CursorOverlayV2 } from './components';

const RealtimeOverlay = () => {
  const atomicActionsAwareness = useFeature(FeatureFlag.ATOMIC_ACTIONS_AWARENESS);

  return <>{atomicActionsAwareness.isEnabled ? <CursorOverlayV2 /> : <CursorOverlay />}</>;
};

export default RealtimeOverlay;
