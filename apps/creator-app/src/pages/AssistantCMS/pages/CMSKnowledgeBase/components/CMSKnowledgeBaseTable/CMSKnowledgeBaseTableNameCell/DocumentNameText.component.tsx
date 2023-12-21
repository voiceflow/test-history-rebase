import { BaseModels } from '@voiceflow/base-types';
import { Table, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';
import { stopPropagation } from '@/utils/handler.util';

interface IDocumentNameText {
  id: string;
  data: BaseModels.Project.KnowledgeBaseText;
  search: string;
}

export const DocumentNameText: React.FC<IDocumentNameText> = ({ id, data, search }) => {
  const downloadOne = useDispatch(Designer.KnowledgeBase.Document.effect.downloadOne);
  const noNewlineName = data.name.replace(/[%0A]+/gm, ' ');

  return (
    <>
      {data.canEdit ? (
        <Table.Cell.Text.Highlighted label={noNewlineName} search={search} overflow={true} />
      ) : (
        <Tooltip.Overflow
          referenceElement={({ ref, onOpen, onClose }) => (
            <Table.Cell.Link
              label={noNewlineName}
              ref={ref}
              onClick={stopPropagation(() => downloadOne(id))}
              overflow
              highlight={search}
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
