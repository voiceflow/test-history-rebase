import { Utils } from '@voiceflow/common';
import React from 'react';

import { VoiceflowAssistantVisibilityContext } from '@/contexts/VoiceflowAssistantVisibility';

export const useHideVoiceflowAssistant = ({ hide = true }: { hide?: boolean } = {}) => {
  const { setIDs: setVisibilityIDs } = React.useContext(VoiceflowAssistantVisibilityContext);

  React.useEffect(() => {
    if (!hide) return undefined;

    const instanceID = Utils.id.cuid.slug();

    setVisibilityIDs((prev) => [...prev, instanceID]);

    return () => {
      setVisibilityIDs((prev) => prev.filter((id) => id !== instanceID));
    };
  }, [hide]);
};
