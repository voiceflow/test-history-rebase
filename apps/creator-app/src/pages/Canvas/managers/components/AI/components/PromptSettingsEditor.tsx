import { BaseUtils } from '@voiceflow/base-types';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';

import PromptSettings, { PromptSettingsProps } from './PromptSettings';

export const PromptSettingsEditor: React.FC<PromptSettingsProps & { data: PromptSettingsProps['data'] & BaseUtils.ai.AIKnowledgeParams }> = (
  props
) => {
  return (
    <>
      <SectionV2.Divider />
      <EditorV2.PersistCollapse namespace={['promptSettings']} defaultCollapsed>
        {({ collapsed, onToggle }) => (
          <SectionV2.CollapseSection
            collapsed={collapsed}
            onToggle={onToggle}
            header={({ collapsed, onToggle }) => (
              <SectionV2.Header onClick={onToggle}>
                <SectionV2.Title bold={!collapsed}>Prompt settings</SectionV2.Title>
                <SectionV2.CollapseArrowIcon collapsed={collapsed} />
              </SectionV2.Header>
            )}
          >
            <PromptSettings {...props} pb={20} />
          </SectionV2.CollapseSection>
        )}
      </EditorV2.PersistCollapse>
    </>
  );
};

export default PromptSettingsEditor;
