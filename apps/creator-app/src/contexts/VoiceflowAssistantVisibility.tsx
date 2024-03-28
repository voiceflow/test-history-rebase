import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { useLocalStorageState } from '@/hooks/storage.hook';
import VoiceflowAssistant from '@/vendors/voiceflowAssistant';

export interface VoiceflowAssistantVisibilityContextValue {
  setIDs: React.Dispatch<React.SetStateAction<string[]>>;
  isShown: boolean;
  isEnabled: boolean;
  onToggleEnabled: VoidFunction;
}

export const VoiceflowAssistantVisibilityContext = React.createContext<VoiceflowAssistantVisibilityContextValue>({
  setIDs: () => {},
  isShown: true,
  isEnabled: true,
  onToggleEnabled: () => {},
});

export const TOGGLE_CHATBOT_KEY = 'persist:in-app-chatbot:toggle';

export const VoiceflowAssistantVisibilityProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [ids, setIDs] = React.useState<string[]>([]);

  const [isEnabled, setIsEnabled] = useLocalStorageState(TOGGLE_CHATBOT_KEY, true);

  const onToggleEnabled = React.useCallback(() => setIsEnabled(!isEnabled), [isEnabled]);

  const isShown = !ids.length && isEnabled;
  React.useEffect(() => {
    if (!isShown) {
      VoiceflowAssistant.hide();
    } else {
      VoiceflowAssistant.show();
    }
  }, [isShown]);

  const api = useContextApi({ setIDs, onToggleEnabled, isEnabled, isShown });

  return <VoiceflowAssistantVisibilityContext.Provider value={api}>{children}</VoiceflowAssistantVisibilityContext.Provider>;
};
