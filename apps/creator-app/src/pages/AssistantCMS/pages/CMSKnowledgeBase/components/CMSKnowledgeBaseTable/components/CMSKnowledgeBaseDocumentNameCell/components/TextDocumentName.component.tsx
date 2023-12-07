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

  const onClick = () => {
    if (data.canEdit) {
      stopPropagation(() => actions.download(documentID));
    }
  };

  return (
    <Tooltip.Overflow
      referenceElement={({ ref, onOpen, onClose }) =>
        data.canEdit ? (
          <Table.Cell.Text.Highlighted
            label={data.name}
            search={filter.search}
            ref={ref}
            onClick={onClick}
            overflow
            onMouseEnter={onOpen}
            onMouseLeave={onClose}
          />
        ) : (
          <Table.Cell.Link label={data.name} ref={ref} onClick={onClick} overflow onMouseEnter={onOpen} onMouseLeave={onClose} />
        )
      }
    >
      {() => <Text breakWord>{data.name}</Text>}
    </Tooltip.Overflow>
  );
};
