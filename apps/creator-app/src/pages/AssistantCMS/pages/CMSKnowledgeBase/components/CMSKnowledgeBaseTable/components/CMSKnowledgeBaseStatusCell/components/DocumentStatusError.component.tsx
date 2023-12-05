import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Box, Icon, Text, Tokens, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import * as Documentation from '@/config/documentation';
import { CMSKnowledgeBaseContext, KnowledgeBaseTableItem } from '@/pages/AssistantCMS/contexts/CMSKnowledgeBase.context';
import { stopPropagation } from '@/utils/handler.util';
import { openInternalURLInANewTab } from '@/utils/window';

import { textStyle } from './DocumentStatusError.css';

export const DocumentStatusError: React.FC<{ item: KnowledgeBaseTableItem }> = ({ item }) => {
  const { actions } = React.useContext(CMSKnowledgeBaseContext);
  let content: React.ReactNode = 'Processing file failed';

  if (item.status.data) {
    content += `: ${item.status.data}`;
  } else if (item.data.type === BaseModels.Project.KnowledgeBaseDocumentType.URL) {
    content = 'Processing URL failed. Ensure the URL is valid and accessible by bots or crawlers.';
  }

  const onRetry = async () => {
    actions.resync([item.documentID]);
  };

  return (
    <Tooltip
      placement="top"
      width={200}
      referenceElement={({ onToggle, ref }) => (
        <Box onMouseEnter={onToggle} ref={ref}>
          <Icon name="Warning" color={Tokens.colors.alert.alert700} height={26} width={24} />
        </Box>
      )}
    >
      {({ onClose }) => (
        <Box direction="column">
          <div style={{ paddingBottom: '6px' }}>
            <Text variant="caption">
              {content}
              <Text
                variant="caption"
                weight="semiBold"
                className={textStyle}
                onClick={stopPropagation(() => openInternalURLInANewTab(Documentation.KB_USAGE))}
              >
                Learn
              </Text>
            </Text>
          </div>
          <Tooltip.Button onClick={stopPropagation(Utils.functional.chainVoid(onRetry, onClose))}>Retry</Tooltip.Button>
        </Box>
      )}
    </Tooltip>
  );
};
