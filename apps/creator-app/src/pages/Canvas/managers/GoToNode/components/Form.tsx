import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import BlockSelect from '@/components/BlockSelect';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

interface FormProps {
  editor: NodeEditorV2Props<Realtime.NodeData.GoToNode>;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Form: React.FC<FormProps> = ({ editor, header, footer }) => {
  const { diagramID, goToNodeID } = editor.data;

  return (
    <EditorV2 header={header ?? <EditorV2.DefaultHeader />} footer={footer ?? <EditorV2.DefaultFooter />}>
      <SectionV2.SimpleSection>
        <BlockSelect
          value={goToNodeID && diagramID ? { stepID: goToNodeID, diagramID } : null}
          onChange={(data) => editor.onChange({ goToNodeID: data?.stepID ?? null, diagramID: data?.diagramID ?? null })}
        />
      </SectionV2.SimpleSection>
    </EditorV2>
  );
};

export default Form;
