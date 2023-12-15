import { Collapsible, CollapsibleHeader, CollapsibleHeaderButton, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { textAreaStyles } from './CMSKnowledgeBaseEditorContent.css';

export interface ICMSKnowledgeBaseEditorContent {
  content: string | null;
  setContent: React.Dispatch<React.SetStateAction<string | null>>;
  onUpdateContent: () => Promise<void>;
}

export const CMSKnowledgeBaseEditorContent: React.FC<ICMSKnowledgeBaseEditorContent> = ({ content, setContent, onUpdateContent }) => {
  return (
    <Collapsible
      isEmpty={!content}
      isOpen={true}
      header={<CollapsibleHeader label="Content">{({ isOpen }) => <CollapsibleHeaderButton isOpen={isOpen} />}</CollapsibleHeader>}
    >
      <TextArea
        className={textAreaStyles}
        value={content || ''}
        minRows={1}
        onValueChange={setContent}
        onBlur={onUpdateContent}
        placeholder="Enter or paste text here"
      />
    </Collapsible>
  );
};
