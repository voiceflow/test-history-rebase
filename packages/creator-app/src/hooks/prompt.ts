import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import { useActiveProjectTypeConfig } from './platformConfig';

export const useArePromptsEmpty = (prompts?: Platform.Base.Models.Prompt.Model[]): boolean => {
  const projectTypeConfig = useActiveProjectTypeConfig();

  return React.useMemo(
    () => !prompts || !!prompts.every((prompt) => !projectTypeConfig.utils.prompt.isPrompt(prompt) || projectTypeConfig.utils.prompt.isEmpty(prompt)),
    [prompts, projectTypeConfig]
  );
};
