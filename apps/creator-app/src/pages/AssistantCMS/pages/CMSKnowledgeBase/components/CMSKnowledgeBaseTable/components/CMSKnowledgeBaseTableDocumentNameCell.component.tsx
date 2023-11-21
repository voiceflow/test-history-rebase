import { BaseModels } from '@voiceflow/base-types';
import { Table, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { KnowledgeBaseContext, KnowledgeBaseTableItem } from '@/pages/KnowledgeBase/context';
import { stopPropagation } from '@/utils/handler.util';

interface IDocumentNameCell {
  type: string;
  item: KnowledgeBaseTableItem;
}

export const DocumentNameCell: React.FC<IDocumentNameCell> = ({ type, item }) => {
  const { actions } = React.useContext(KnowledgeBaseContext);
  return (
    <Table.Cell.GroupName
      type={type}
      item={item}
      label={({ data }) => (
        <Tooltip.Overflow
          referenceElement={({ ref, onOpen, onClose }) =>
            data.type === BaseModels.Project.KnowledgeBaseDocumentType.URL ? (
              <Tooltip.Overflow
                referenceElement={({ ref, onOpen, onClose }) => (
                  <Table.Cell.Link href={data.url} label={data.url} target="blank" overflow ref={ref} onMouseEnter={onOpen} onMouseLeave={onClose} />
                )}
              >
                {() => <Text breakWord>{data.url}</Text>}
              </Tooltip.Overflow>
            ) : (
              <Table.Cell.Text
                label={data.name}
                ref={ref}
                onClick={stopPropagation(() => actions.download(item.documentID))}
                overflow
                onMouseEnter={onOpen}
                onMouseLeave={onClose}
              ></Table.Cell.Text>
            )
          }
        >
          {() => <Text breakWord>{data.name}</Text>}
        </Tooltip.Overflow>
      )}
      count={({ count }) => <Table.Cell.Count count={count} />}
    />
  );
};
