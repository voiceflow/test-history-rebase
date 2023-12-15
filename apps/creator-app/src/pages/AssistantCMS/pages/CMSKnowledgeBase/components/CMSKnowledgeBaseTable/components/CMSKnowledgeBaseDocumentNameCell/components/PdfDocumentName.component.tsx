import { BaseModels } from '@voiceflow/base-types';
import { Table, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { CMSKnowledgeBaseContext } from '@/pages/AssistantCMS/contexts/CMSKnowledgeBase.context';
import { stopPropagation } from '@/utils/handler.util';

export const PdfDocumentName: React.FC<{
  data: BaseModels.Project.KnowledgeBasePDF;
  documentID: string;
}> = ({ data, documentID }) => {
  const { actions, state } = React.useContext(CMSKnowledgeBaseContext);

  return (
    <Tooltip.Overflow
      referenceElement={({ ref, onOpen, onClose }) => (
        <Table.Cell.Link
          label={data.name}
          highlight={state.search}
          ref={ref}
          onClick={stopPropagation(() => actions.openPdfFile(documentID))}
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
