import { Nullable } from '@voiceflow/common';
import { ErrorMessage, Input, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import { InputRenderer } from '../../Primitive/LinkUpload';
import { transformVariablesToReadable, validateURL } from '../../utils';

export interface UploadLinkInputProps {
  onChangeText: (value: string) => void;
  placeholder: string;
  renderInput?: InputRenderer;
  validate?: (text: string) => Nullable<string> | Promise<null>;
  value?: string | null;
}

export type { InputRenderer };

const UploadLinkInput: React.FC<UploadLinkInputProps> = ({
  onChangeText,
  value = '',
  validate = validateURL,
  placeholder,
  renderInput,
}) => {
  const [error, setError] = React.useState<Nullable<string>>(null);
  const inputRef = React.useRef<HTMLDivElement & { getCurrentValue: () => { text: string } }>();

  const validateAndUpdate = async (value: string | null) => {
    if (!value) {
      setError(null);
      onChangeText('');
      return;
    }

    try {
      const error = await validate(value);
      if (error) {
        throw error;
      }

      onChangeText(value);
    } catch (error) {
      if (typeof error === 'string') {
        setError(error);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(JSON.stringify(error));
      }
    }
  };

  useDidUpdateEffect(() => {
    setError(null);
  }, [value]);

  const inputProps = {
    error: !!error,
    fullWidth: true,
    placeholder,
  };

  return (
    <div>
      {renderInput ? (
        renderInput({
          ...inputProps,
          ref: inputRef,
          creatable: false,
          skipBlurOnUnmount: true,
          onBlur: () => validateAndUpdate(transformVariablesToReadable(inputRef.current?.getCurrentValue().text)),
          onEnterPress: () => validateAndUpdate(transformVariablesToReadable(inputRef.current?.getCurrentValue().text)),
          value,
          multiline: true,
        })
      ) : (
        <Input
          {...inputProps}
          error={!!error}
          onChangeText={onChangeText}
          onEnterPress={() => validateAndUpdate(value)}
          value={value || ''}
        />
      )}
      {error && <ErrorMessage mb={0}>{error}</ErrorMessage>}
    </div>
  );
};

export default UploadLinkInput;
