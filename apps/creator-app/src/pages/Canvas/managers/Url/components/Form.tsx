import type * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2, toast } from '@voiceflow/ui';
import React from 'react';

import type { VariablesInputValue } from '@/components/VariablesInput';
import VariablesInput from '@/components/VariablesInput';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import type { NodeEditorV2Props } from '@/pages/Canvas/managers/types';
import { containsVariable, isValidURL } from '@/utils/string';

interface FormProps {
  editor: NodeEditorV2Props<Realtime.NodeData.Url, Realtime.NodeData.UrlBuiltInPorts>;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Form: React.FC<FormProps> = ({ editor, header, footer }) => {
  const onChange = ({ text }: VariablesInputValue) => {
    if (!text || containsVariable(text) || isValidURL(text)) {
      editor.onChange({ url: text });
    } else {
      toast.error('URL is not valid, please enter valid link');
    }
  };

  return (
    <EditorV2 header={header ?? <EditorV2.DefaultHeader />} footer={footer ?? <EditorV2.DefaultFooter />}>
      <SectionV2.SimpleSection>
        <VariablesInput
          value={editor.data.url}
          onBlur={onChange}
          multiline
          autoFocus={!editor.data.url}
          placeholder="Enter URL"
          onEnterPress={onChange}
        />
      </SectionV2.SimpleSection>
    </EditorV2>
  );
};

export default Form;
