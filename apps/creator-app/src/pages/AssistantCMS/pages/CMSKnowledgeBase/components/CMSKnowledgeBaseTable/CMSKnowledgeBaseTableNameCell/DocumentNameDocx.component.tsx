import { BaseModels } from '@voiceflow/base-types';
import { Table, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';
import { stopPropagation } from '@/utils/handler.util';

interface IDocumentNameDocx {
  id: string;
  data: BaseModels.Project.KnowledgeBaseDocx;
  search: string;
}

export const DocumentNameDocx: React.FC<IDocumentNameDocx> = ({ id, data, search }) => {
  const downloadOne = useDispatch(Designer.KnowledgeBase.Document.effect.downloadOne);

  return (
    <Tooltip.Overflow
      referenceElement={({ ref, onOpen, onClose }) => (
        <Table.Cell.Link
          ref={ref}
          label={data.name}
          onClick={stopPropagation(() => downloadOne(id))}
          overflow
          highlight={search}
          onMouseEnter={onOpen}
          onMouseLeave={onClose}
        />
      )}
    >
      {() => (
        <Text variant="caption" breakWord>
          {data.name}
        </Text>
      )}
    </Tooltip.Overflow>
  );
};
