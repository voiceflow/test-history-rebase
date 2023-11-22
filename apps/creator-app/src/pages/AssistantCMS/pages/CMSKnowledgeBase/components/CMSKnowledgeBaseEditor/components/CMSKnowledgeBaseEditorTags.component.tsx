import { Collapsible, CollapsibleHeader, CollapsibleHeaderButton, TextArea } from '@voiceflow/ui-next';
import React from 'react';

export interface ICMSKnowledgeBaseEditorTags {
  onTagsChange: (tags: string) => void;
  tags: string[];
}

export const CMSKnowledgeBaseEditorTags: React.FC<ICMSKnowledgeBaseEditorTags> = ({ tags, onTagsChange }) => {
  return (
    <Collapsible
      isEmpty={!tags}
      header={<CollapsibleHeader label="Tags">{({ isOpen }) => <CollapsibleHeaderButton isOpen={isOpen} />}</CollapsibleHeader>}
    >
      <TextArea value={tags.join(', ')} minRows={1} onValueChange={onTagsChange} />
    </Collapsible>
  );
};
