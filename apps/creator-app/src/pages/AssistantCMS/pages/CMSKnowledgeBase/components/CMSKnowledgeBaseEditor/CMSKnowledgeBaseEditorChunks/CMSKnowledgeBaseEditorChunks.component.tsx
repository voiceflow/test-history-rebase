import { Box, Collapsible, CollapsibleHeader, CollapsibleHeaderButton, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { contentStyles, dividerStyles, headerStyles, sectionBox } from './CMSKnowledgeBaseEditorChunks.css';
import { ICMSKnowledgeBaseEditorChunks } from './CMSKnowledgeBaseEditorChunks.interface';

export const CMSKnowledgeBaseEditorChunks: React.FC<ICMSKnowledgeBaseEditorChunks> = ({ chunks, disabled }) => {
  if (!chunks) return null;

  return (
    <Collapsible
      isOpen={!disabled && !!chunks.length}
      isEmpty={!chunks}
      isDisabled={disabled}
      contentClassName={contentStyles}
      containerClassName={sectionBox}
      dividerClassName={dividerStyles}
      header={
        <CollapsibleHeader label="Chunks" isDisabled={disabled} caption={chunks.length.toString()} className={headerStyles} isSection>
          {({ isOpen }) => <CollapsibleHeaderButton disabled={disabled} isOpen={isOpen} />}
        </CollapsibleHeader>
      }
    >
      <Box gap={12} direction="column" pb={24}>
        {chunks.map(({ content, chunkID }) => (
          <TextArea.AutoSize key={chunkID} variant="chunk" value={content} disabled />
        ))}
      </Box>
    </Collapsible>
  );
};
