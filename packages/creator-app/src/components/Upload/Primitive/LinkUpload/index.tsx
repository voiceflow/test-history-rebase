import { Nullable } from '@voiceflow/common';
import { Badge, Input, stopPropagation } from '@voiceflow/ui';
import React from 'react';
import validUrl from 'valid-url';

import VariablesInput from '@/components/VariablesInput';
import { transformVariablesToReadable } from '@/utils/slot';

import { BackArrow, ErrorMessage, LinkUploadInputContainer } from './components';

const NoTypeVariablesInput = VariablesInput as any;

const validURL: (text: string) => Nullable<string> = (text: string) => {
  if (!validUrl.isUri(text)) return 'Bad URL';
  return null;
};

interface LinkUploadProps {
  onUpdate: (value: string) => void;
  onBack: VoidFunction;
  validate?: (text: string) => Nullable<string>;
  placeholder: string;
  withVariables?: boolean;
}

const LinkUpload: React.FC<LinkUploadProps> = ({ onUpdate, onBack, validate = validURL, placeholder, withVariables }) => {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState<Nullable<string>>(null);
  const variablesRef = React.useRef<any>();

  const validateAndUpdate = (value: string) => {
    setError(null);

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
    error,
    fullWidth: true,
    leftAction: onBack ? <BackArrow icon="back" size={14} onClick={stopPropagation(onBack)} /> : null,
    placeholder,
  };

  return (
    <LinkUploadInputContainer>
      {withVariables ? (
        <NoTypeVariablesInput
          {...inputProps}
          ref={variablesRef}
          creatable={false}
          rightAction={
            <Badge onClick={() => validateAndUpdate(transformVariablesToReadable(variablesRef.current?.getCurrentValue().text))}>Enter</Badge>
          }
          onEnterPress={() => validateAndUpdate(transformVariablesToReadable(variablesRef.current?.getCurrentValue().text))}
          onEditorStateChange={error ? () => setError(null) : null}
        />
      ) : (
        <Input
          {...inputProps}
          error={!!error}
          rightAction={<Badge onClick={() => validateAndUpdate(value)}>Enter</Badge>}
          onChangeText={setValue}
          onEnterPress={() => validateAndUpdate(value)}
        />
      )}
      <ErrorMessage>{error}</ErrorMessage>
    </LinkUploadInputContainer>
  );
};

export default LinkUpload;
