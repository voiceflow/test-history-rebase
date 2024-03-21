import { BaseModels } from '@voiceflow/base-types';
import { Table, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

interface IDocumentNameTable {
  id: string;
  data: BaseModels.Project.KnowledgeBaseTable;
  search: string;
}

export const DocumentNameTable: React.FC<IDocumentNameTable> = ({ data, search }) => {
  return (
    <Tooltip.Overflow
      referenceElement={({ ref, onOpen, onClose }) => (
        <Table.Cell.Link
          label={data.name}
          ref={ref}
          overflow
          highlight={search}
          onMouseEnter={onOpen}
          onMouseLeave={onClose}
          style={{ pointerEvents: 'none' }}
        />
      )}
    >
      {() => <Text breakWord>{data.name}</Text>}
    </Tooltip.Overflow>
  );
};
