import { BaseModels } from '@voiceflow/base-types';
import { Table, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { decodeTextDocumentTitle } from '@/ducks/designer/knowledge-base/document/document.utils';
import { useDispatch } from '@/hooks/store.hook';
import { stopPropagation } from '@/utils/handler.util';

interface IDocumentNameText {
  id: string;
  data: BaseModels.Project.KnowledgeBaseText;
  search: string;
}

export const DocumentNameText: React.FC<IDocumentNameText> = ({ id, data, search }) => {
  const downloadOne = useDispatch(Designer.KnowledgeBase.Document.effect.downloadOne);
  const [documentName, setDocumentName] = React.useState<string>('');

  React.useEffect(() => {
    decodeTextDocumentTitle(data.name)
      .then((parsedName) => setDocumentName(parsedName.replace(/[%0A]+/gm, ' ')))
      .catch(() => {});
  }, [documentName]);

  return (
    <>
      {data.canEdit ? (
        <Table.Cell.Text.Highlighted label={documentName} search={search} overflow={true} />
      ) : (
        <Tooltip.Overflow
          referenceElement={({ ref, onOpen, onClose }) => (
            <Table.Cell.Link
              label={documentName}
              ref={ref}
              onClick={stopPropagation(() => downloadOne(id))}
              overflow
              highlight={search}
              onMouseEnter={onOpen}
              onMouseLeave={onClose}
            />
          )}
        >
          {() => <Text breakWord>{documentName}</Text>}
        </Tooltip.Overflow>
      )}
    </>
  );
};
