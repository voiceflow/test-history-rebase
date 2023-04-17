import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import GoToIntentSelect from '@/components/GoToIntentSelect';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

interface FormProps {
  editor: NodeEditorV2Props<Realtime.NodeData.GoToIntent>;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Form: React.FC<FormProps> = ({ editor, header, footer }) => (
  <EditorV2 header={header ?? <EditorV2.DefaultHeader />} footer={footer ?? <EditorV2.DefaultFooter />}>
    <SectionV2.SimpleSection>
      <GoToIntentSelect
        value={editor.data.intent ? { intentID: editor.data.intent, diagramID: editor.data.diagramID ?? null } : null}
        onChange={(data) => editor.onChange({ intent: data?.intentID ?? null, diagramID: data?.diagramID ?? null })}
        placeholder="Select an intent"
        clearOnSelectActive
      />
    </SectionV2.SimpleSection>
  </EditorV2>
);

export default Form;
