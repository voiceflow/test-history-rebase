import { Collapsible, CollapsibleHeader, CollapsibleHeaderButton, TextArea } from '@voiceflow/ui-next';
import React from 'react';

interface DescriptionProps {
  description?: string | null;
}

export const Description: React.FC<DescriptionProps> = ({ description }) => {
  if (!description?.length) return null;

  return (
    <Collapsible
      showDivider
      header={
        <CollapsibleHeader label="Description">
          {({ isOpen, headerChildrenStyles }) => <CollapsibleHeaderButton headerChildrenStyles={headerChildrenStyles} isOpen={isOpen} />}
        </CollapsibleHeader>
      }
    >
      <TextArea minRows={4} maxRows={17} variant="chunk" readOnly value={description || ''} placeholder="Enter intent description" />
    </Collapsible>
  );
};
