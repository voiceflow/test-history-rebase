import { Input, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { useToggle } from '@/hooks';

export interface HideableInput {
  value: any;
  onChangeText?: (newText: string) => void | Promise<void>;
  placeholder?: string;

  /**
   * See here: https://www.chromium.org/developers/design-documents/create-amazing-password-forms/#use-autocomplete-attributes
   */
  autocomplete?: string;
}

const HideableInput: React.FC<HideableInput> = ({ value, placeholder, onChangeText, autocomplete }) => {
  const [showSecret, toggleShowSecret] = useToggle();

  return (
    <Input
      type={showSecret ? 'text' : 'password'}
      value={value}
      onChangeText={onChangeText}
      rightAction={<SvgIcon icon={showSecret ? 'eyeHide' : 'eye'} color="#6E849A" onClick={toggleShowSecret} clickable />}
      placeholder={placeholder}
      autoComplete={autocomplete ?? 'cc-number'}
    />
  );
};

export default HideableInput;
