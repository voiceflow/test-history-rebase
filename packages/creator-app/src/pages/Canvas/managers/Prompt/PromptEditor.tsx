import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import Section from '@/components/Section';
import { HeaderVariant } from '@/components/Section/components/HeaderLabel';
import { NodeData } from '@/models';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { useChipOption, useNoReplyOption } from '@/pages/Canvas/managers/components/responseOptions';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { HelpTooltip } from './components';

const PromptEditor: NodeEditor<NodeData.Prompt> = ({ data, onChange, pushToPath }) => {
  const [noReplyOption, NoReplyPage] = useNoReplyOption({ data, onChange, pushToPath });
  const [chipOption, ChipPage] = useChipOption({ data, onChange, pushToPath });

  const onRepromptClick = React.useCallback(() => pushToPath?.({ type: 'reprompts', label: 'Reprompts' }), [pushToPath]);

  return (
    <Content
      footer={() => (
        <Controls
          menu={<OverflowMenu placement="top-end" options={[noReplyOption, chipOption]} />}
          tutorial={{ content: <HelpTooltip />, blockType: data.type }}
        />
      )}
    >
      <Section customContentStyling={{ color: '#62778c' }}>Prompts will stop & listen for the user to match an intent.</Section>
      <Section header="Reprompt" headerVariant={HeaderVariant.LINK} isLink onClick={onRepromptClick}></Section>
      {NoReplyPage}
      {ChipPage}
    </Content>
  );
};

export default PromptEditor;
