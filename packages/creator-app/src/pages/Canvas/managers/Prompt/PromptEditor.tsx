import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import Section from '@/components/Section';
import { HeaderVariant } from '@/components/Section/components/HeaderLabel';
import { NodeData } from '@/models';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { useButtonOption, useNoReplyOption } from '@/pages/Canvas/managers/components/responseOptions';
import { NodeEditor } from '@/pages/Canvas/managers/types';
import { getNoMatchSectionLabel } from '@/pages/Canvas/managers/utils';

import { HelpTooltip } from './components';

const PromptEditor: NodeEditor<NodeData.Prompt> = ({ data, onChange, pushToPath }) => {
  const [noReplyOption, noReplyPage] = useNoReplyOption({ data, onChange, pushToPath });
  const [buttonOption, buttonPage] = useButtonOption({ data, onChange, pushToPath });

  const onRepromptClick = React.useCallback(() => pushToPath?.({ type: 'reprompts', label: 'No Match' }), [pushToPath]);

  return (
    <Content
      footer={() => (
        <Controls
          menu={<OverflowMenu placement="top-end" options={[noReplyOption, buttonOption]} />}
          tutorial={{ content: <HelpTooltip />, blockType: data.type }}
        />
      )}
    >
      <Section customContentStyling={{ color: '#62778c' }}>Prompts will stop & listen for the user to match an intent.</Section>

      {buttonPage}

      <Section
        infix={getNoMatchSectionLabel(data.noMatchReprompt.type)}
        header="No Match"
        isLink
        onClick={onRepromptClick}
        headerVariant={HeaderVariant.LINK}
      />

      {noReplyPage}
    </Content>
  );
};

export default PromptEditor;
