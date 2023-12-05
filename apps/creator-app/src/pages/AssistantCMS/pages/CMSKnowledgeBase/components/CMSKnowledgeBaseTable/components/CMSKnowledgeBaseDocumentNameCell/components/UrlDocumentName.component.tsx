import { BaseModels } from '@voiceflow/base-types';
import { Table, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

export const UrlDocumentName: React.FC<{ data: BaseModels.Project.KnowledgeBaseURL }> = ({ data }) => (
  <Tooltip.Overflow
    referenceElement={({ ref, onOpen, onClose }) => (
      <Table.Cell.Link href={data.url} label={data.url} target="blank" overflow ref={ref} onMouseEnter={onOpen} onMouseLeave={onClose} />
    )}
  >
    {() => <Text breakWord>{data.url}</Text>}
  </Tooltip.Overflow>
);
