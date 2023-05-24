import { BaseModels } from '@voiceflow/base-types';
import { Box, ThemeColor } from '@voiceflow/ui';
import React from 'react';

export const ACCEPT_TYPES: { [key in BaseModels.Project.KnowledgeBaseDocumentType]?: string } = {
  [BaseModels.Project.KnowledgeBaseDocumentType.TEXT]: '.txt',
  [BaseModels.Project.KnowledgeBaseDocumentType.PDF]: '.pdf',
  [BaseModels.Project.KnowledgeBaseDocumentType.DOCX]: '.docx,.doc',
};

export const createOptionLabel = (label: string, secondary?: string) => (
  <Box.FlexApart width={112} alignItems="baseline">
    {label}
    {secondary && (
      <Box fontSize={13} color={ThemeColor.TERTIARY}>
        {secondary}
      </Box>
    )}
  </Box.FlexApart>
);
