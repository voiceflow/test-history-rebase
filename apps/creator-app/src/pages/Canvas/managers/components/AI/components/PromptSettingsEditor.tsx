import type { BaseUtils } from '@voiceflow/base-types';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import type { IAIPromptSettings } from '@/components/AI/AIPromptSettings/AIPromptSettings.component';
import { AIPromptSettings } from '@/components/AI/AIPromptSettings/AIPromptSettings.component';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

interface IPromptSettingsEditor extends IAIPromptSettings {
  value: IAIPromptSettings['value'] & BaseUtils.ai.AIKnowledgeParams;
  onValueChange: (data: Partial<IAIPromptSettings['value'] & BaseUtils.ai.AIKnowledgeParams>) => void;
}

export const PromptSettingsEditor: React.FC<IPromptSettingsEditor> = ({ value, onValueChange, containerProps }) => {
  return (
    <>
      <SectionV2.Divider />

      <EditorV2.PersistCollapse namespace={['promptSettings']} defaultCollapsed>
        {({ collapsed, onToggle }) => (
          <SectionV2.CollapseSection
            onToggle={onToggle}
            collapsed={collapsed}
            header={({ collapsed, onToggle }) => (
              <SectionV2.Header onClick={onToggle}>
                <SectionV2.Title bold={!collapsed}>Prompt settings</SectionV2.Title>
                <SectionV2.CollapseArrowIcon collapsed={collapsed} />
              </SectionV2.Header>
            )}
          >
            <AIPromptSettings
              value={value}
              onValueChange={onValueChange}
              containerProps={{ ...containerProps, pb: 20 }}
            />
          </SectionV2.CollapseSection>
        )}
      </EditorV2.PersistCollapse>
    </>
  );
};
