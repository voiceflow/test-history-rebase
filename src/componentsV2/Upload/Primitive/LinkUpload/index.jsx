import React from 'react';
import validUrl from 'valid-url';

import Badge from '@/componentsV2/Badge';
import Input from '@/componentsV2/Input';
import VariablesInput from '@/componentsV2/VariablesInput';
import { SLOT_REGEXP } from '@/constants';
import { stopPropagation, withKeyPress } from '@/utils/dom';

import { BackArrow, ErrorMessage, LinkUploadInputContainer } from './components';

const validURL = (text) => {
  if (!validUrl.isUri(text)) return 'Bad URL';
  return null;
};

const transformVariables = (text) => text.replace(SLOT_REGEXP, '{$1}').trim();

// eslint-disable-next-line lodash/prefer-constant
function LinkUpload({ onUpdate, onBack, validate = validURL, placeholder, withVariables }) {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState(null);
  const variablesRef = React.useRef();

  const validateAndUpdate = (value) => {
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
        <VariablesInput
          {...inputProps}
          ref={variablesRef}
          creatable={false}
          rightAction={<Badge onClick={() => validateAndUpdate(transformVariables(variablesRef.current.getCurrentValue().text))}>Enter</Badge>}
          onEnterPress={() => validateAndUpdate(transformVariables(variablesRef.current.getCurrentValue().text))}
          onEditorStateChange={error ? () => setError(null) : null}
        />
      ) : (
        <Input
          {...inputProps}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={withKeyPress(13, () => validateAndUpdate(value))}
          rightAction={<Badge onClick={() => validateAndUpdate(value)}>Enter</Badge>}
        />
      )}
      <ErrorMessage>{error}</ErrorMessage>
    </LinkUploadInputContainer>
  );
}

export default LinkUpload;
