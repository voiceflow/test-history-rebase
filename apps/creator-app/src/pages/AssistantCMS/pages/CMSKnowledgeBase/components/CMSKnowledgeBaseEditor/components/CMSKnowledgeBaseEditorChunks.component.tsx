import { Box, Collapsible, CollapsibleHeader, CollapsibleHeaderButton, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { KnowledgeBaseChunks } from '@/pages/AssistantCMS/contexts/CMSKnowledgeBase.context';

import { contentStyles, headerStyles, sectionBox } from './CMSKnowledgeBaseEditorChunks.css';

export interface ICMSKnowledgeBaseEditorChunks {
  chunks: KnowledgeBaseChunks[] | undefined;
  isDisabled?: boolean;
}

export const CMSKnowledgeBaseEditorChunks: React.FC<ICMSKnowledgeBaseEditorChunks> = ({ chunks, isDisabled }) => {
  if (!chunks) return null;
  return (
    <Collapsible
      isEmpty={!chunks}
      isOpen={!isDisabled && chunks.length > 0}
      isDisabled={isDisabled}
      header={
        <CollapsibleHeader label="Chunks" isDisabled={isDisabled} caption={chunks.length.toString()} className={headerStyles} isSection>
          {({ isOpen }) => <CollapsibleHeaderButton disabled={isDisabled} isOpen={isOpen} />}
        </CollapsibleHeader>
      }
      contentClassName={contentStyles}
      containerClassName={sectionBox}
    >
      <Box gap={12} direction="column" pb={24}>
        {chunks.map(({ content, chunkID }) => (
          <TextArea.AutoSize variant="chunk" key={chunkID} value={content} disabled />
        ))}
      </Box>
    </Collapsible>
  );
};
