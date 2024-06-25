import { tid } from '@voiceflow/style';
import { Collapsible, CollapsibleHeader, CollapsibleHeaderButton, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { textAreaStyles } from './CMSKnowledgeBaseEditorContent.css';
import type { ICMSKnowledgeBaseEditorContent } from './CMSKnowledgeBaseEditorContent.interface';

const TESTID = tid('document', 'content');

export const CMSKnowledgeBaseEditorContent: React.FC<ICMSKnowledgeBaseEditorContent> = ({
  value,
  onBlur,
  onValueChange,
}) => {
  return (
    <Collapsible
      header={
        <CollapsibleHeader label="Content">
          {({ isOpen }) => <CollapsibleHeaderButton isOpen={isOpen} testID={tid(TESTID, 'toggle-collapsed')} />}
        </CollapsibleHeader>
      }
      isEmpty={!value}
      isOpen={true}
      testID={tid(TESTID, 'section')}
    >
      <TextArea
        value={value || ''}
        onBlur={onBlur}
        minRows={1}
        className={textAreaStyles}
        placeholder="Enter or paste text here..."
        onValueChange={onValueChange}
        testID={TESTID}
      />
    </Collapsible>
  );
};
