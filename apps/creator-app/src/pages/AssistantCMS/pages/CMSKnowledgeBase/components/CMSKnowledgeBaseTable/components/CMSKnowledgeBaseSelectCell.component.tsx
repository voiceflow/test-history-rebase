import { Box, Icon, LoadingSpinner, Table, Tokens } from '@voiceflow/ui-next';
import React from 'react';

import { CMSKnowledgeBaseContext, KnowledgeBaseTableItem } from '@/pages/AssistantCMS/contexts/CMSKnowledgeBase.context';

export const CMSKnowledgeBaseSelectCell: React.FC<{ item: KnowledgeBaseTableItem }> = ({ item }) => {
  const { state } = React.useContext(CMSKnowledgeBaseContext);

  if (state.processingDocumentIds.includes(item.documentID)) {
    return <LoadingSpinner size="medium" variant="dark" />;
  }

  if (state.finishedProcessingDocumentIds.includes(item.documentID)) {
    return (
      <Box ml={-6}>
        <Icon name="Checkmark" height={26} width={24} color={Tokens.colors.success.success700} />
      </Box>
    );
  }

  return <Table.Cell.Select item={item} />;
};
