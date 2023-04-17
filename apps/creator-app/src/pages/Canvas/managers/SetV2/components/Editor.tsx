import * as Realtime from '@voiceflow/realtime-sdk';
import { Input, SectionV2, useLinkedState, withInputBlur } from '@voiceflow/ui';
import React from 'react';

import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import Form from './Form';

const Editor: NodeEditorV2<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts> = (props) => {
  const [stepName, setStepName] = useLinkedState(props.data.title);

  return (
    <Form editor={props}>
      <SectionV2.SimpleSection>
        <Input
          value={stepName}
          onBlur={() => props.onChange({ title: stepName })}
          placeholder="Enter set label"
          onEnterPress={withInputBlur()}
          onChangeText={setStepName}
        />
      </SectionV2.SimpleSection>

      <SectionV2.Divider />
    </Form>
  );
};

export default Editor;
