import { tid } from '@voiceflow/style';
import { Collapsible, CollapsibleHeader, CollapsibleHeaderButton, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { useInput } from '@/hooks/input.hook';

import type { ICMSEditorDescription } from './CMSEditorDescription.interface';

export const CMSEditorDescription: React.FC<ICMSEditorDescription> = ({
  value,
  showDivider = true,
  placeholder,
  onValueChange,
  testID,
}) => {
  const input = useInput<string, HTMLTextAreaElement>({
    value,
    onSave: onValueChange,
  });

  return (
    <Collapsible
      isEmpty={!value}
      showDivider={showDivider}
      noBottomPadding
      testID={tid(testID, 'section')}
      header={
        <CollapsibleHeader className="sss" label="Description">
          {({ isOpen }) => <CollapsibleHeaderButton isOpen={isOpen} testID={tid(testID, 'toggle-collapsed')} />}
        </CollapsibleHeader>
      }
    >
      <TextArea {...input.attributes} minRows={4} maxRows={17} placeholder={placeholder} testID={testID} />
    </Collapsible>
  );
};
