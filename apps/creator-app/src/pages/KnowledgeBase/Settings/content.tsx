import { BaseModels } from '@voiceflow/base-types';
import { Box, Input, SectionV2, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import PromptSettings from '@/pages/Canvas/managers/components/AI/components/PromptSettings';

export interface KnowledgeBaseSettingsProps {
  settings: BaseModels.Project.KnowledgeBaseSettings;
  setSettings: React.Dispatch<React.SetStateAction<BaseModels.Project.KnowledgeBaseSettings | null>>;
}

const KnowledgeBaseSettings: React.FC<KnowledgeBaseSettingsProps> = ({ settings, setSettings }) => {
  const { summarization, search } = settings;

  const update = React.useCallback(
    <T extends keyof BaseModels.Project.KnowledgeBaseSettings>(property: T) =>
      (data: Partial<BaseModels.Project.KnowledgeBaseSettings[T]>) => {
        setSettings((settings) => (settings ? { ...settings, [property]: { ...settings[property], ...data } } : null));
      },
    []
  );

  return (
    <>
      <PromptSettings data={summarization} onChange={update('summarization')} my={24} />
      <SectionV2.Divider />
      <SectionV2.Content py={24}>
        <Box.Flex gap={12} maxWidth={100}>
          <Box.FlexColumn gap={11} alignItems="flex-start">
            <TippyTooltip
              delay={250}
              placement="top-start"
              content="Determines how many data source chunks (per document) will be passed to the LMM as context to generate a response.  Recommend 2-3 to avoid too much noise and content in prompt."
            >
              <SectionV2.Title secondary bold>
                Chunk Limit
              </SectionV2.Title>
            </TippyTooltip>
            <Input.Range defaultValue={3} min={1} max={10} value={search.limit} onChange={(limit) => update('search')({ limit })} />
          </Box.FlexColumn>
        </Box.Flex>
      </SectionV2.Content>
    </>
  );
};

export default KnowledgeBaseSettings;
