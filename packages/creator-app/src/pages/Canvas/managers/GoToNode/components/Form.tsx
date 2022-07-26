import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import BlockSelect from '@/components/BlockSelect';
import { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

interface FormProps {
  editor: NodeEditorV2Props<Realtime.NodeData.GoToNode>;
}

const Form: React.FC<FormProps> = ({ editor }) => {
  const { diagramID, goToNodeID } = editor.data;

  return (
    <SectionV2.SimpleContentSection header={<SectionV2.Title bold>Go to Block</SectionV2.Title>} contentProps={{ bottomOffset: 2.5 }}>
      <BlockSelect
        value={goToNodeID && diagramID ? { stepID: goToNodeID, diagramID } : null}
        onChange={(data) => editor.onChange({ goToNodeID: data?.stepID ?? null, diagramID: data?.diagramID ?? null })}
        clearable
        clearOnSelectActive
      />
    </SectionV2.SimpleContentSection>
  );
};

export default Form;
