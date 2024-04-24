import { BaseModels } from '@voiceflow/base-types';
import { Table, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';
import { stopPropagation } from '@/utils/handler.util';

interface IDocumentNamePdf {
  id: string;
  data: BaseModels.Project.KnowledgeBasePDF;
  search: string;
}

export const DocumentNamePdf: React.FC<IDocumentNamePdf> = ({ id, data, search }) => {
  const previewOne = useDispatch(Designer.KnowledgeBase.Document.effect.previewOne);

  return (
    <Tooltip.Overflow
      referenceElement={({ ref, onOpen, onClose }) => (
        <Table.Cell.Link
          label={data.name}
          ref={ref}
          onClick={stopPropagation(() => previewOne(id))}
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
