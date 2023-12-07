import { Box, Collapsible, CollapsibleHeader, CollapsibleHeaderButton, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { KnowledgeBaseChunks } from '@/pages/AssistantCMS/contexts/CMSKnowledgeBase.context';

import { contentStyles, headerStyles, sectionBox } from './CMSKnowledgeBaseEditorChunks.css';

export interface ICMSKnowledgeBaseEditorChunks {
  chunks: KnowledgeBaseChunks[] | undefined;
}

export const CMSKnowledgeBaseEditorChunks: React.FC<ICMSKnowledgeBaseEditorChunks> = ({ chunks }) => {
  if (!chunks) return null;
  return (
    <Collapsible
      isEmpty={!chunks}
      isOpen={true}
      header={
        <CollapsibleHeader label="Chunks" caption={chunks.length.toString()} className={headerStyles}>
          {({ isOpen }) => <CollapsibleHeaderButton isOpen={isOpen} />}
        </CollapsibleHeader>
      }
      contentClassName={contentStyles}
      containerClassName={sectionBox}
    >
      <Box gap={12} direction="column">
        {chunks.map(({ content, chunkID }) => (
          <TextArea variant="chunk" key={chunkID} value={content} disabled />
        ))}
      </Box>
    </Collapsible>
  );
};
