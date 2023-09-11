import { Collapsible, CollapsibleHeader, CollapsibleHeaderButton, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { useInput } from '@/hooks/input.hook';

import type { ICMSEditorDescription } from './CMSEditorDescription.interface';

export const CMSEditorDescription: React.FC<ICMSEditorDescription> = ({ value, placeholder, onValueChange }) => {
  const input = useInput({
    value,
    onSave: onValueChange,
  });

  return (
    <Collapsible
      isEmpty={!value}
      header={<CollapsibleHeader label="Description">{({ isOpen }) => <CollapsibleHeaderButton isOpen={isOpen} />}</CollapsibleHeader>}
    >
      <TextArea {...input.attributes} minRows={4} placeholder={placeholder} />
    </Collapsible>
  );
};
