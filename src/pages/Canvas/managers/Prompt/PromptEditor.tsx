import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import Section from '@/components/Section';
import { HeaderVariant } from '@/components/Section/components/HeaderLabel';
import { NodeData } from '@/models';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import NoReplyResponse, { repromptFactory } from '@/pages/Canvas/components/NoReplyResponse';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

import { HelpTooltip } from './components';

const OverflowMenuAny: any = OverflowMenu;

const PromptEditor: NodeEditorPropsType<NodeData.Prompt> = ({ data, onChange, pushToPath }) => {
  const hasReprompt = !!data.reprompt;
  const toggleReprompt = React.useCallback(() => onChange({ reprompt: hasReprompt ? null : repromptFactory() }), [hasReprompt, onChange]);
  const onRepromptClick = React.useCallback(() => pushToPath?.({ type: 'reprompts', label: 'Reprompts' }), [pushToPath]);

  return (
    <Content
      footer={() => (
        <Controls
          menu={
            <OverflowMenuAny
              placement="top-end"
              options={[
                {
                  label: hasReprompt ? 'Remove No Reply Response' : 'Add  No Reply Response',
                  onClick: toggleReprompt,
                },
              ]}
            />
          }
          tutorial={{ content: <HelpTooltip />, blockType: data.type }}
        />
      )}
    >
      <Section customContentStyling={{ color: '#62778c' }}>Prompts will stop & listen to the user to match an intent.</Section>
      <Section header="Reprompt" headerVariant={HeaderVariant.LINK} isLink onClick={onRepromptClick}></Section>
      {hasReprompt && <NoReplyResponse pushToPath={pushToPath} />}
    </Content>
  );
};

export default PromptEditor;
