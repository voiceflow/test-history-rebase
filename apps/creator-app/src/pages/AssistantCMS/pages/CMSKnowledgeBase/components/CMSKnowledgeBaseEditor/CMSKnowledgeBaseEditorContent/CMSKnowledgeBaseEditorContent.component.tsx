import { Collapsible, CollapsibleHeader, CollapsibleHeaderButton, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { textAreaStyles } from './CMSKnowledgeBaseEditorContent.css';
import { ICMSKnowledgeBaseEditorContent } from './CMSKnowledgeBaseEditorContent.interface';

export const CMSKnowledgeBaseEditorContent: React.FC<ICMSKnowledgeBaseEditorContent> = ({ value, onBlur, onValueChange }) => {
  return (
    <Collapsible
      header={<CollapsibleHeader label="Content">{({ isOpen }) => <CollapsibleHeaderButton isOpen={isOpen} />}</CollapsibleHeader>}
      isEmpty={!value}
      isOpen={true}
    >
      <TextArea
        value={value || ''}
        onBlur={onBlur}
        minRows={1}
        className={textAreaStyles}
        placeholder="Enter or paste text here"
        onValueChange={onValueChange}
      />
    </Collapsible>
  );
};
