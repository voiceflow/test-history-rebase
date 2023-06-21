import { BaseUtils } from '@voiceflow/base-types';
import { SectionV2, System } from '@voiceflow/ui';
import React from 'react';

import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks/realtime';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

import PromptSettings, { PromptSettingsProps } from './PromptSettings';

export const PromptSettingsEditor: React.FC<PromptSettingsProps & { data: PromptSettingsProps['data'] & BaseUtils.ai.AIKnowledgeParams }> = (
  props
) => {
  const goToKnowledgeBase = useDispatch(Router.goToCurrentKnowledgeBase);

  return (
    <>
      <SectionV2.Divider />
      {props.data.source === BaseUtils.ai.DATA_SOURCE.KNOWLEDGE_BASE ? (
        <SectionV2.SimpleSection>
          <System.Link.Anchor onClick={goToKnowledgeBase}>Knowledge Base Settings</System.Link.Anchor>
        </SectionV2.SimpleSection>
      ) : (
        <EditorV2.PersistCollapse namespace={['promptSettings']} defaultCollapsed>
          {({ collapsed, onToggle }) => (
            <SectionV2.CollapseSection
              collapsed={collapsed}
              onToggle={onToggle}
              header={({ collapsed, onToggle }) => (
                <SectionV2.Header onClick={onToggle} sticky>
                  <SectionV2.Title bold={!collapsed}>Prompt settings</SectionV2.Title>
                  <SectionV2.CollapseArrowIcon collapsed={collapsed} />
                </SectionV2.Header>
              )}
            >
              <PromptSettings {...props} pb={20} />
            </SectionV2.CollapseSection>
          )}
        </EditorV2.PersistCollapse>
      )}
    </>
  );
};

export default PromptSettingsEditor;
