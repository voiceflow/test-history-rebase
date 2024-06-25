import { tid } from '@voiceflow/style';
import { Box, Chunk, Collapsible, CollapsibleHeader, CollapsibleHeaderButton } from '@voiceflow/ui-next';
import React from 'react';

import {
  chunkBoxStyles,
  contentStyles,
  dividerStyles,
  headerStyles,
  sectionBox,
} from './CMSKnowledgeBaseEditorChunks.css';
import type { ICMSKnowledgeBaseEditorChunks } from './CMSKnowledgeBaseEditorChunks.interface';

export const CMSKnowledgeBaseEditorChunks: React.FC<ICMSKnowledgeBaseEditorChunks> = ({ chunks, disabled }) => {
  const TEST_ID = tid('document', 'chunks');

  if (!chunks) return null;

  return (
    <Box height="100%" className={chunkBoxStyles({ disabled })}>
      <Collapsible
        isOpen={!disabled && !!chunks.length}
        isEmpty={!chunks}
        isDisabled={disabled}
        contentClassName={contentStyles}
        containerClassName={sectionBox}
        dividerClassName={dividerStyles}
        testID={TEST_ID}
        header={
          <CollapsibleHeader
            label="Chunks"
            isDisabled={disabled}
            caption={chunks.length.toString()}
            className={headerStyles}
            isSection
            testID={tid(TEST_ID, 'header')}
          >
            {({ isOpen }) => (
              <CollapsibleHeaderButton disabled={disabled} isOpen={isOpen} testID={tid(TEST_ID, 'toggle-collapsed')} />
            )}
          </CollapsibleHeader>
        }
      >
        <Box gap={12} direction="column" pb={24}>
          {chunks.map(({ content, chunkID }) => (
            <Chunk key={chunkID} content={content} disabled testID={tid(TEST_ID, 'item')} />
          ))}
        </Box>
      </Collapsible>
    </Box>
  );
};
