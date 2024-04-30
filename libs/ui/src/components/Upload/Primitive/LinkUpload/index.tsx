import type { Nullable } from '@voiceflow/common';
import React from 'react';
import validUrl from 'valid-url';

import Badge from '@/components/Badge';
import Input from '@/components/Input';
import { stopPropagation } from '@/utils';

import { transformVariablesToReadable } from '../../utils';
import * as S from './styles';

const validURL: (text: string) => Nullable<string> = (text: string) => {
  if (!validUrl.isUri(text)) return 'Bad URL';
  return null;
};

export interface RenderInputProps {
  creatable: boolean;
  error?: boolean;
  fullWidth: boolean;
  leftAction?: JSX.Element | null;
  onEditorStateChange?: VoidFunction;
  onEnterPress?: VoidFunction;
  onBlur?: VoidFunction;
  placeholder?: string;
  multiline?: boolean;
  skipBlurOnUnmount?: boolean;
  ref: React.RefObject<any>;
  rightAction?: JSX.Element | null;

  value?: string | null;
}

export type InputRenderer = (props: RenderInputProps) => JSX.Element;
export interface LinkUploadProps {
  onUpdate: (value: string) => void;
  onBack: VoidFunction;
  validate?: (text: string) => Nullable<string>;
  placeholder: string;
  renderInput?: InputRenderer;
}

const LinkUpload: React.FC<LinkUploadProps> = ({ onUpdate, onBack, validate = validURL, placeholder, renderInput }) => {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState<Nullable<string>>(null);
  const variablesRef = React.useRef<any>();

  const validateAndUpdate = (value: string) => {
    const newError = validate(value);

    setError(newError);

    if (newError) {
      return;
    }

    onUpdate(value);
  };

  React.useEffect(() => {
    setError(null);
  }, [value]);

  const inputProps = {
    error: !!error,
    fullWidth: true,
    leftAction: onBack ? <S.BackArrow icon="back" size={14} onClick={stopPropagation(onBack)} /> : null,
    placeholder,
  };

  return (
    <S.LinkUploadInputContainer>
      {renderInput ? (
        renderInput({
          ...inputProps,
          ref: variablesRef,
          creatable: false,
          rightAction: (
            <Badge
              onClick={() =>
                validateAndUpdate(transformVariablesToReadable(variablesRef.current?.getCurrentValue().text))
              }
            >
              Enter
            </Badge>
          ),
          onEnterPress: () =>
            validateAndUpdate(transformVariablesToReadable(variablesRef.current?.getCurrentValue().text)),
          onEditorStateChange: error ? () => setError(null) : undefined,
        })
      ) : (
        <Input
          {...inputProps}
          rightAction={<Badge onClick={() => validateAndUpdate(value)}>Enter</Badge>}
          onChangeText={setValue}
          onEnterPress={() => validateAndUpdate(value)}
        />
      )}
      {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
    </S.LinkUploadInputContainer>
  );
};

export default LinkUpload;
