import { BaseModels } from '@voiceflow/base-types';
import { Table, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { CMSKnowledgeBaseContext } from '@/pages/AssistantCMS/contexts/CMSKnowledgeBase.context';

export const UrlDocumentName: React.FC<{ data: BaseModels.Project.KnowledgeBaseURL }> = ({ data }) => {
  const { state } = React.useContext(CMSKnowledgeBaseContext);

  return (
    <Tooltip.Overflow
      referenceElement={({ ref, onOpen, onClose }) => (
        <Table.Cell.Link
          href={data.url}
          highlight={state.search}
          label={data.name}
          target="blank"
          overflow
          ref={ref}
          onMouseEnter={onOpen}
          onMouseLeave={onClose}
        />
      )}
    >
      {() => <Text breakWord>{data.url}</Text>}
    </Tooltip.Overflow>
  );
};
