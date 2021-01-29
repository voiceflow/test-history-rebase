import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import Section from '@/components/Section';
import { HeaderVariant } from '@/components/Section/components/HeaderLabel';
import { PlatformType } from '@/constants';
import { useIsPlatform } from '@/ducks/skill/hooks';
import { NodeData } from '@/models';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import NoReplyResponse, { repromptFactory } from '@/pages/Canvas/components/NoReplyResponse';
import SuggestionChips, { chipFactory } from '@/pages/Canvas/components/SuggestionChips';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { HelpTooltip } from './components';

const PromptEditor: NodeEditor<NodeData.Prompt> = ({ data, onChange, pushToPath }) => {
  const hasReprompt = !!data.reprompt;
  const toggleReprompt = React.useCallback(() => onChange({ reprompt: hasReprompt ? null : repromptFactory() }), [hasReprompt, onChange]);
  const onRepromptClick = React.useCallback(() => pushToPath?.({ type: 'reprompts', label: 'Reprompts' }), [pushToPath]);

  const hasChips = !!data.chips;
  const toggleChips = React.useCallback(() => onChange({ chips: hasChips ? null : chipFactory() }), [hasChips, onChange]);

  const isAlexa = useIsPlatform(PlatformType.ALEXA);

  return (
    <Content
      footer={() => (
        <Controls
          menu={
            <OverflowMenu
              placement="top-end"
              options={[
                {
                  label: hasReprompt ? 'Remove No Reply Response' : 'Add  No Reply Response',
                  onClick: toggleReprompt,
                },
                ...(!isAlexa
                  ? [
                      {
                        label: hasChips ? 'Remove Suggestion Chips' : 'Add Suggestion Chips',
                        onClick: toggleChips,
                      },
                    ]
                  : []),
              ]}
            />
          }
          tutorial={{ content: <HelpTooltip />, blockType: data.type }}
        />
      )}
    >
      <Section customContentStyling={{ color: '#62778c' }}>Prompts will stop & listen for the user to match an intent.</Section>
      <Section header="Reprompt" headerVariant={HeaderVariant.LINK} isLink onClick={onRepromptClick}></Section>
      {hasReprompt && <NoReplyResponse pushToPath={pushToPath} />}
      {hasChips && <SuggestionChips pushToPath={pushToPath!} />}
    </Content>
  );
};

export default PromptEditor;
