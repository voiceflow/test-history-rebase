import { useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import VoiceflowAssistant from '@/vendors/voiceflowAssistant';

export const VoiceflowAssistantVisibilityContext = React.createContext<React.Dispatch<React.SetStateAction<string[]>>>(() => {});

export const VoiceflowAssistantVisibilityProvider: React.OldFC = ({ children }) => {
  const [ids, setIDs] = React.useState<string[]>([]);

  useDidUpdateEffect(() => {
    if (ids.length) {
      VoiceflowAssistant.hide();
    } else {
      VoiceflowAssistant.show();
    }
  }, [ids]);

  return <VoiceflowAssistantVisibilityContext.Provider value={setIDs}>{children}</VoiceflowAssistantVisibilityContext.Provider>;
};
