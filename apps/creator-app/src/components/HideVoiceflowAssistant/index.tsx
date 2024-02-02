import React from 'react';

import { useHideVoiceflowAssistant } from '@/hooks';

const HideVoiceflowAssistant: React.FC<{ hide?: boolean }> = ({ hide }) => {
  useHideVoiceflowAssistant({ hide });

  return null;
};

export default HideVoiceflowAssistant;
