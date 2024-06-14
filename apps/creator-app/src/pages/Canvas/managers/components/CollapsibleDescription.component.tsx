import { Collapsible, CollapsibleHeader, CollapsibleHeaderButton, TextArea } from '@voiceflow/ui-next';
import React from 'react';

interface ICollapsibleDescription {
  value: string | null;
  readyOnly?: boolean;
  onValueChange?: (value: string) => void;
}

export const CollapsibleDescription: React.FC<ICollapsibleDescription> = ({ value, readyOnly, onValueChange }) => {
  return (
    <Collapsible
      isEmpty={!value}
      showDivider
      header={
        <CollapsibleHeader label="Description">
          {({ isOpen, headerChildrenStyles }) => (
            <CollapsibleHeaderButton headerChildrenStyles={headerChildrenStyles} isOpen={isOpen} />
          )}
        </CollapsibleHeader>
      }
    >
      <TextArea
        value={value ?? ''}
        variant={readyOnly ? 'chunk' : 'default'}
        minRows={4}
        maxRows={17}
        readOnly={readyOnly}
        placeholder="Enter description"
        onValueChange={onValueChange}
      />
    </Collapsible>
  );
};
