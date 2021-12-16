import React from 'react';

import { FeatureFlag } from '@/config/features';
import { useFeature } from '@/hooks';

import DialogManagerAPIKey from './dialogManagerAPIKey';
import LegacyAPIKey from './legacyAPIKey';

const API: React.FC = () => {
  const dialogManagerAPIKeyEnabled = useFeature(FeatureFlag.DM_API_KEY)?.isEnabled;

  if (dialogManagerAPIKeyEnabled) {
    return <DialogManagerAPIKey />;
  }

  return <LegacyAPIKey />;
};

export default API;
