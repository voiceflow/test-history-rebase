import { BaseUtils } from '@voiceflow/base-types';
import React from 'react';

import VariablesInput from '@/components/VariablesInput';

export interface PromptInputProps<T> {
  value: BaseUtils.ai.AIContextParams;
  onChange: (value: Partial<BaseUtils.ai.AIContextParams>) => void;
  placeholder?: string;
  onContentChange?: (hasContent: boolean) => void;
  InputWrapper?: {
    Component: React.ComponentType<T>;
    props: T;
  };
}

function PromptInput<T extends React.PropsWithChildren>(props: PromptInputProps<T>): React.ReactElement;
function PromptInput(props: PromptInputProps<React.PropsWithChildren>): React.ReactElement {
  const { InputWrapper = { Component: React.Fragment, props: {} }, value, onChange, placeholder, onContentChange } = props;

  return (
    <InputWrapper.Component {...InputWrapper.props}>
      <VariablesInput
        placeholder={placeholder || 'Enter prompt'}
        value={value.prompt}
        onBlur={({ text }) => onChange({ prompt: text })}
        multiline
        newLineOnEnter
        onEditorStateChange={(state) => onContentChange?.(state.getCurrentContent().hasText())}
      />
    </InputWrapper.Component>
  );
}

export default PromptInput;
