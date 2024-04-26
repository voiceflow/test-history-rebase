import type * as Realtime from '@voiceflow/realtime-sdk';
import { Input, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { useLinkedState } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { useNodeLabel } from './hooks';

const StartLabelSection: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Start>();
  const nodeLabel = useNodeLabel();

  const [localLabel, setLocalLabel] = useLinkedState(editor.data.label || nodeLabel);

  return (
    <SectionV2.SimpleSection isAccent>
      <Input
        value={localLabel}
        onBlur={() => (localLabel ? editor.onChange({ label: localLabel }) : setLocalLabel(editor.data.label))}
        placeholder="Enter a label"
        onChangeText={setLocalLabel}
      />
    </SectionV2.SimpleSection>
  );
};

export default StartLabelSection;
