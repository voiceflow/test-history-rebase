import type { BaseModels } from '@voiceflow/base-types';
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
          ref={ref}
          label={data.name}
          overflow
          highlight={search}
          isClickable={false}
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
