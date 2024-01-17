import { BaseModels } from '@voiceflow/base-types';
import { Table, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

interface IDocumentNameURL {
  id: string;
  data: BaseModels.Project.KnowledgeBaseURL;
  search: string;
}

export const DocumentNameURL: React.FC<IDocumentNameURL> = ({ data, search }) => (
  <Tooltip.Overflow
    referenceElement={({ ref, onOpen, onClose }) => (
      <Table.Cell.Link
        ref={ref}
        href={data.url}
        label={data.name}
        target="blank"
        overflow
        isSelectable
        highlight={search}
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
      />
    )}
  >
    {() => <Text breakWord>{data.url}</Text>}
  </Tooltip.Overflow>
);
