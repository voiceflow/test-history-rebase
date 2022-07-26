import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import GoToIntentSelect from '@/components/GoToIntentSelect';
import { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

interface FormProps {
  editor: NodeEditorV2Props<Realtime.NodeData.GoToIntent>;
}

const Form: React.FC<FormProps> = ({ editor }) => (
  <SectionV2.SimpleContentSection header={<SectionV2.Title bold>Go to Intent</SectionV2.Title>} contentProps={{ bottomOffset: 2.5 }}>
    <GoToIntentSelect
      onChange={(data) => editor.onChange({ intent: data?.intentID ?? null, diagramID: data?.diagramID ?? null })}
      intentID={editor.data.intent}
      diagramID={editor.data.diagramID}
      placeholder="Select an intent"
      clearOnSelectActive
    />
  </SectionV2.SimpleContentSection>
);

export default Form;
