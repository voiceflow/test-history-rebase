import React from 'react';

import { useHideVoiceflowAssistant } from '@/hooks';

const HideVoiceflowAssistant: React.OldFC = () => {
  useHideVoiceflowAssistant();

  return null;
};

export default HideVoiceflowAssistant;
