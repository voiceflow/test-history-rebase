import { BaseModels } from '@voiceflow/base-types';
import { Table, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { CMSKnowledgeBaseContext } from '@/pages/AssistantCMS/contexts/CMSKnowledgeBase.context';
import { stopPropagation } from '@/utils/handler.util';

export const DocxDocumentName: React.FC<{
  data: BaseModels.Project.KnowledgeBaseText | BaseModels.Project.KnowledgeBaseDocx;
  documentID: string;
}> = ({ data, documentID }) => {
  const { actions, filter } = React.useContext(CMSKnowledgeBaseContext);

  return (
    <Tooltip.Overflow
      referenceElement={({ ref, onOpen, onClose }) => (
        <Table.Cell.Text.Highlighted
          label={data.name}
          search={filter.search}
          ref={ref}
          onClick={stopPropagation(() => actions.download(documentID))}
          overflow
          onMouseEnter={onOpen}
          onMouseLeave={onClose}
        />
      )}
    >
      {() => <Text breakWord>{data.name}</Text>}
    </Tooltip.Overflow>
  );
};
