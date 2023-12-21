import { Collapsible, CollapsibleHeader, CollapsibleHeaderButton, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { ICMSKnowledgeBaseEditorTags } from './CMSKnowledgeBaseEditorTags.interface';

export const CMSKnowledgeBaseEditorTags: React.FC<ICMSKnowledgeBaseEditorTags> = ({ value, onValueChange }) => {
  return (
    <Collapsible
      header={<CollapsibleHeader label="Tags">{({ isOpen }) => <CollapsibleHeaderButton isOpen={isOpen} />}</CollapsibleHeader>}
      isEmpty={!value.length}
    >
      <TextArea value={value.join(', ')} minRows={1} onValueChange={onValueChange} />
    </Collapsible>
  );
};
