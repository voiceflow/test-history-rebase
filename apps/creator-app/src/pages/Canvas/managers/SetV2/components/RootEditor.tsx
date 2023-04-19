import * as Realtime from '@voiceflow/realtime-sdk';
import { Input, SectionV2, useLinkedState, withInputBlur } from '@voiceflow/ui';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';

import Form from './Form';

const RootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts>();

  const [stepName, setStepName] = useLinkedState(editor.data.title);

  return (
    <Form
      editor={editor}
      beforeList={
        <>
          <SectionV2.SimpleSection>
            <Input
              value={stepName}
              onBlur={() => editor.onChange({ title: stepName })}
              placeholder="Enter set label"
              onEnterPress={withInputBlur()}
              onChangeText={setStepName}
            />
          </SectionV2.SimpleSection>
          <SectionV2.Divider />
        </>
      }
    />
  );
};

export default RootEditor;
