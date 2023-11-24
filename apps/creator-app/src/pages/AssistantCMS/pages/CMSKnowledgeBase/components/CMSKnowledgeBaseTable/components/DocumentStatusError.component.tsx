import { BaseModels } from '@voiceflow/base-types';
import { Box, Icon, Tokens, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { KnowledgeBaseTableItem } from '@/pages/KnowledgeBase/context';

export const DocumentStatusError: React.FC<{ item: KnowledgeBaseTableItem }> = ({ item }) => {
  let content: React.ReactNode = 'Processing file failed';

  if (item.status.data) {
    content += `: ${item.status.data}`;
  } else if (item.data.type === BaseModels.Project.KnowledgeBaseDocumentType.URL) {
    content =
      'Proccessing URL failed. Please check if the URL is valid and accessible by bots. Often websites block web crawlers from accessing their content.';
  }

  return (
    <Tooltip
      referenceElement={({ onToggle, ref }) => (
        <Box onMouseEnter={onToggle} onMouseLeave={onToggle} ref={ref}>
          <Icon name="Warning" color={Tokens.colors.alert.alert700} height={26} width={24} />
        </Box>
      )}
    >
      {() => <>{content}</>}
    </Tooltip>
  );
};
