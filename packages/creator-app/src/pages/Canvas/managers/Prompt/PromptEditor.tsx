import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import Section from '@/components/Section';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { useButtonsOptionSection, useNoMatchOptionSection, useNoReplyOptionSection } from '@/pages/Canvas/managers/hooks';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { HelpTooltip } from './components';

const PromptEditor: NodeEditor<Realtime.NodeData.Prompt, Realtime.NodeData.PromptBuiltInPorts> = ({ data, onChange, pushToPath }) => {
  const [buttonsOption, buttonsSection] = useButtonsOptionSection({ data, onChange, pushToPath });
  const [noReplyOption, noReplySection] = useNoReplyOptionSection({ data, onChange, pushToPath });
  const [noMatchOption, noMatchSection] = useNoMatchOptionSection({ data, onChange, pushToPath });

  return (
    <Content
      footer={() => (
        <Controls
          menu={<OverflowMenu placement="top-end" options={[noMatchOption, noReplyOption, buttonsOption]} />}
          tutorial={{ content: <HelpTooltip />, blockType: data.type }}
        />
      )}
    >
      <Section customContentStyling={{ color: '#62778c' }}>Prompts will stop & listen for the user to match an intent.</Section>

      {buttonsSection}

      {noMatchSection}

      {noReplySection}
    </Content>
  );
};

export default PromptEditor;
