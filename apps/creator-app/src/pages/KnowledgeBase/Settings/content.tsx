import { BaseModels } from '@voiceflow/base-types';
import { Box } from '@voiceflow/ui';
import React from 'react';

import PromptSettings from '@/pages/Canvas/managers/components/AI/components/PromptSettings';

export interface KnowledgeBaseSettingsProps {
  settings: BaseModels.Project.KnowledgeBaseSettings;
  setSettings: React.Dispatch<React.SetStateAction<BaseModels.Project.KnowledgeBaseSettings | null>>;
}

const KnowledgeBaseSettings: React.FC<KnowledgeBaseSettingsProps> = ({ settings, setSettings }) => {
  const { summarization } = settings;

  const update = React.useCallback(
    <T extends keyof BaseModels.Project.KnowledgeBaseSettings>(property: T) =>
      (data: Partial<BaseModels.Project.KnowledgeBaseSettings[T]>) => {
        setSettings((settings) => (settings ? { ...settings, [property]: { ...settings[property], ...data } } : null));
      },
    []
  );

  return (
    <Box mt={24} mb={12}>
      <PromptSettings data={summarization} onChange={update('summarization')} />
    </Box>
  );
};

export default KnowledgeBaseSettings;
