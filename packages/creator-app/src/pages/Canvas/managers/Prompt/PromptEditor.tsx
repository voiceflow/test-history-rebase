import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import Section from '@/components/Section';
import { NodeData } from '@/models';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { NoMatchSection } from '@/pages/Canvas/components/NoMatch';
import { useButtonsOptionSection, useNoReplyOptionSection } from '@/pages/Canvas/managers/hooks';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { HelpTooltip } from './components';

const PromptEditor: NodeEditor<NodeData.Prompt> = ({ data, onChange, pushToPath }) => {
  const [buttonsOption, buttonsSection] = useButtonsOptionSection({ data, onChange, pushToPath });
  const [noReplyOption, noReplySection] = useNoReplyOptionSection({ data, onChange, pushToPath });

  return (
    <Content
      footer={() => (
        <Controls
          menu={<OverflowMenu placement="top-end" options={[noReplyOption, buttonsOption]} />}
          tutorial={{ content: <HelpTooltip />, blockType: data.type }}
        />
      )}
    >
      <Section customContentStyling={{ color: '#62778c' }}>Prompts will stop & listen for the user to match an intent.</Section>

      {buttonsSection}

      <NoMatchSection data={data.noMatchReprompt} pushToPath={pushToPath} />

      {noReplySection}
    </Content>
  );
};

export default PromptEditor;
