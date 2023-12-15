import { BaseModels } from '@voiceflow/base-types';
import { Table, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { CMSKnowledgeBaseContext } from '@/pages/AssistantCMS/contexts/CMSKnowledgeBase.context';
import { stopPropagation } from '@/utils/handler.util';

export const TextDocumentName: React.FC<{
  data: BaseModels.Project.KnowledgeBaseText;
  documentID: string;
}> = ({ data, documentID }) => {
  const { actions, state } = React.useContext(CMSKnowledgeBaseContext);
  const noNewlineName = data.name.replace(/[%0A]+/gm, ' ');

  return (
    <>
      {data.canEdit ? (
        <Table.Cell.Text.Highlighted label={noNewlineName} search={state.search} overflow={true} />
      ) : (
        <Tooltip.Overflow
          referenceElement={({ ref, onOpen, onClose }) => (
            <Table.Cell.Link
              label={noNewlineName}
              highlight={state.search}
              ref={ref}
              onClick={stopPropagation(() => actions.download(documentID))}
              overflow
              onMouseEnter={onOpen}
              onMouseLeave={onClose}
            />
          )}
        >
          {() => <Text breakWord>{noNewlineName}</Text>}
        </Tooltip.Overflow>
      )}
    </>
  );
};
