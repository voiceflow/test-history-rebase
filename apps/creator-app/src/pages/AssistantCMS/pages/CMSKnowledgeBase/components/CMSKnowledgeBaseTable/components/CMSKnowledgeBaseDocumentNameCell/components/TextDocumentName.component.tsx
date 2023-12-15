import { BaseModels } from '@voiceflow/base-types';
import { Table, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { CMSKnowledgeBaseContext } from '@/pages/AssistantCMS/contexts/CMSKnowledgeBase.context';
import { stopPropagation } from '@/utils/handler.util';

export const TextDocumentName: React.FC<{
  data: BaseModels.Project.KnowledgeBaseText;
  documentID: string;
}> = ({ data, documentID }) => {
  const { actions, filter } = React.useContext(CMSKnowledgeBaseContext);
  const noNewlineName = data.name.replace(/[%0A]+/gm, ' ');
  return (
    <Tooltip.Overflow
      referenceElement={({ ref, onOpen, onClose }) =>
        data.canEdit ? (
          <Table.Cell.Text.Highlighted label={noNewlineName} search={filter.search} ref={ref} overflow onMouseEnter={onOpen} onMouseLeave={onClose} />
        ) : (
          <Table.Cell.Link
            label={noNewlineName}
            ref={ref}
            onClick={stopPropagation(() => actions.download(documentID))}
            overflow
            onMouseEnter={onOpen}
            onMouseLeave={onClose}
          />
        )
      }
    >
      {() => <Text breakWord>{noNewlineName}</Text>}
    </Tooltip.Overflow>
  );
};
