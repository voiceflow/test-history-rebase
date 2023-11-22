import { Box, Collapsible, CollapsibleHeader, CollapsibleHeaderButton, TextArea } from '@voiceflow/ui-next';
import React from 'react';

export interface ICMSKnowledgeBaseEditorChunks {
  chunks: string[];
}

export const CMSKnowledgeBaseEditorChunks: React.FC<ICMSKnowledgeBaseEditorChunks> = ({ chunks }) => {
  return (
    <Collapsible
      isEmpty={!chunks}
      isOpen={true}
      header={
        <CollapsibleHeader label="Chunks" caption={chunks.length.toString()}>
          {({ isOpen }) => <CollapsibleHeaderButton isOpen={isOpen} />}
        </CollapsibleHeader>
      }
    >
      <Box gap={12} direction="column">
        {chunks.map((chunk, index) => (
          <TextArea key={index} value={chunk} minRows={1} disabled />
        ))}
      </Box>
    </Collapsible>
  );
};
