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

const safeDecodeURIComponent = (str: string) => {
  return str
    .split('%')
    .map(function (part, index) {
      // We don't want to decode the first part
      if (index === 0) return part;

      try {
        // Try to decode each part
        return decodeURIComponent(`%${part}`);
      } catch (e) {
        // If it fails, just return the original part
        return `%${part}`;
      }
    })
    .join('');
};

export const DocumentNameText: React.FC<IDocumentNameText> = ({ id, data, search }) => {
  const downloadOne = useDispatch(Designer.KnowledgeBase.Document.effect.downloadOne);

  const nameWithoutNewLines = React.useMemo(() => {
    const decodedName = safeDecodeURIComponent(data.name);
    return decodedName.replace(/\n/g, '');
  }, [data.name]);

  return (
    <>
      {data.canEdit ? (
        <Table.Cell.Text.Highlighted label={nameWithoutNewLines} search={search} overflow={true} />
      ) : (
        <Tooltip.Overflow
          referenceElement={({ ref, onOpen, onClose }) => (
            <Table.Cell.Link
              label={nameWithoutNewLines}
              ref={ref}
              onClick={stopPropagation(() => downloadOne(id))}
              overflow
              highlight={search}
              onMouseEnter={onOpen}
              onMouseLeave={onClose}
            />
          )}
        >
          {() => <Text breakWord>{nameWithoutNewLines}</Text>}
        </Tooltip.Overflow>
      )}
    </>
  );
};
