import Input from '@ui/components/Input';
import { useDidUpdateEffect } from '@ui/hooks';
import { Nullable } from '@voiceflow/common';
import React from 'react';
import validUrl from 'valid-url';

import { transformVariablesToReadable } from '../../utils';
import * as S from './styles';

const validURL: (text: string) => Nullable<string> = (text: string) => {
  if (!validUrl.isUri(text)) return 'Bad URL';
  return null;
};

export interface RenderInputProps {
  creatable: boolean;
  error: string | null;
  fullWidth: boolean;
  onEditorStateChange: VoidFunction | null;
  onEnterPress: VoidFunction;
  placeholder?: string;
  ref: React.RefObject<any>;
  value?: string | null;
}

export type InputRenderer = (props: RenderInputProps) => JSX.Element;
export interface UploadLinkInputProps {
  onChangeText: (value: string) => void;
  placeholder: string;
  renderInput?: InputRenderer;
  validate?: (text: string) => Nullable<string>;
  value?: string | null;
}

const UploadLinkInput: React.FC<UploadLinkInputProps> = ({ onChangeText, value = '', validate = validURL, placeholder, renderInput }) => {
  const [error, setError] = React.useState<Nullable<string>>(null);
  const variablesRef = React.useRef<HTMLDivElement & { getCurrentValue: () => { text: string } }>();

  const validateAndUpdate = (value: string | null) => {
    if (!value) {
      setError(null);
      onChangeText('');
      return;
    }

    const newError = validate(value);

    setError(newError || null);

    if (newError) {
      return;
    }

    onChangeText(value);
  };

  useDidUpdateEffect(() => {
    setError(null);
  }, [value]);

  const inputProps = {
    error,
    fullWidth: true,
    placeholder,
  };

  return (
    <S.Container>
      {renderInput ? (
        renderInput({
          ...inputProps,
          ref: variablesRef,
          creatable: false,
          onEnterPress: () => validateAndUpdate(transformVariablesToReadable(variablesRef.current?.getCurrentValue().text)),
          onEditorStateChange: error ? () => setError(null) : null,
          value,
        })
      ) : (
        <Input {...inputProps} error={!!error} onChangeText={onChangeText} onEnterPress={() => validateAndUpdate(value)} value={value || ''} />
      )}
      <S.ErrorMessage>{error}</S.ErrorMessage>
    </S.Container>
  );
};

export default UploadLinkInput;
