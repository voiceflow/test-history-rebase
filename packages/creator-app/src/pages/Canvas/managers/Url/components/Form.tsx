import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2, toast } from '@voiceflow/ui';
import React from 'react';

import VariablesInput, { VariablesInputValue } from '@/components/VariablesInput';
import { NodeEditorV2Props } from '@/pages/Canvas/managers/types';
import { containsSlotOtVariable, isAnyLink } from '@/utils/string';

interface FormProps {
  editor: NodeEditorV2Props<Realtime.NodeData.Url, Realtime.NodeData.UrlBuiltInPorts>;
}

const Form: React.FC<FormProps> = ({ editor }) => {
  const onChange = ({ text }: VariablesInputValue) => {
    if (!text || containsSlotOtVariable(text) || isAnyLink(text)) {
      editor.onChange({ url: text });
    } else {
      toast.error('URL is not valid, please enter valid link');
    }
  };

  return (
    <SectionV2.SimpleContentSection header={<SectionV2.Title bold>URL</SectionV2.Title>} contentProps={{ bottomOffset: 2.5 }}>
      <VariablesInput
        value={editor.data.url}
        onBlur={onChange}
        multiline
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={!editor.data.url}
        placeholder="Enter URL"
        onEnterPress={onChange}
      />
    </SectionV2.SimpleContentSection>
  );
};

export default Form;
