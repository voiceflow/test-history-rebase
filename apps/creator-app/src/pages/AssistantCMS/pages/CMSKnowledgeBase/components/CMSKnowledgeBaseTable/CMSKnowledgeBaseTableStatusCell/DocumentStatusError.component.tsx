import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Box, Icon, Text, Tokens, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';
import { stopPropagation } from '@/utils/handler.util';

import type { ICMSKnowledgeBaseTableStatusCell } from './CMSKnowledgeBaseTableStatusCell.interface';

export const DocumentStatusError: React.FC<ICMSKnowledgeBaseTableStatusCell> = ({ item }) => {
  const retryOne = useDispatch(Designer.KnowledgeBase.Document.effect.retryOne);

  let content: React.ReactNode = 'Processing file failed';

  if (item.statusData) {
    content += `: ${item.statusData}`;
  } else if (item.data?.type === BaseModels.Project.KnowledgeBaseDocumentType.URL) {
    content = 'Processing URL failed. Ensure the URL is valid and accessible by bots or crawlers.';
  }

  return (
    <Tooltip
      width={200}
      inline
      placement="top"
      referenceElement={({ ref, onOpen, onClose, popper }) => (
        <Box ref={ref} my={-3} onMouseEnter={onOpen} onMouseLeave={onClose}>
          <Icon name="Warning" color={Tokens.colors.alert.alert700} height={26} width={24} />
          {popper}
        </Box>
      )}
    >
      {({ onClose }) => (
        <Box direction="column" gap={6}>
          <Text variant="caption">{content}</Text>

          <Tooltip.Button
            label="Retry"
            onClick={stopPropagation(Utils.functional.chainVoid(onClose, () => retryOne(item.id)))}
          />
        </Box>
      )}
    </Tooltip>
  );
};
