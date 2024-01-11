import { Utils } from '@voiceflow/common';
import React from 'react';

import { VoiceflowAssistantVisibilityContext } from '@/contexts/VoiceflowAssistantVisibility';

export const useHideVoiceflowAssistant = (options?: { hide?: boolean }) => {
  const { setIDs: setVisibilityIDs } = React.useContext(VoiceflowAssistantVisibilityContext);

  React.useEffect(() => {
    if (!options?.hide) return;

    const instanceID = Utils.id.cuid.slug();

    setVisibilityIDs((prev) => [...prev, instanceID]);

    return () => {
      setVisibilityIDs((prev) => prev.filter((id) => id !== instanceID));
    };
  }, [options?.hide]);
};
