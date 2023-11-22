import { Collapsible, CollapsibleHeader, CollapsibleHeaderButton, TextArea } from '@voiceflow/ui-next';
import React from 'react';

export interface ICMSKnowledgeBaseEditorContent {
  onContentChange: (value: string) => void;
  content: string;
}

export const CMSKnowledgeBaseEditorContent: React.FC<ICMSKnowledgeBaseEditorContent> = ({ content, onContentChange }) => {
  return (
    <Collapsible
      isEmpty={!content}
      isOpen={true}
      header={<CollapsibleHeader label="Content">{({ isOpen }) => <CollapsibleHeaderButton isOpen={isOpen} />}</CollapsibleHeader>}
    >
      <TextArea value={content} minRows={1} onValueChange={onContentChange} />
    </Collapsible>
  );
};
