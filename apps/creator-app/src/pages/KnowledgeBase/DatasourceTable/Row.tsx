import { ContextMenu, Table, TableTypes } from '@voiceflow/ui';
import React from 'react';

import { KnowledgeBaseContext, KnowledgeBaseTableItem } from '@/pages/KnowledgeBase/context';

const Row: React.FC<React.PropsWithChildren<TableTypes.ConfigurableRowProps<KnowledgeBaseTableItem>>> = ({ item, children, ...rowProps }) => {
  const {
    actions: { remove },
  } = React.useContext(KnowledgeBaseContext);

  const options = React.useMemo(
    () => [
      {
        label: 'Remove',
        onClick: () => remove(item.documentID),
      },
    ],
    []
  );

  return (
    <ContextMenu options={options} selfDismiss>
      {({ onContextMenu, isOpen }) => (
        <Table.Row {...rowProps} active={isOpen} onContextMenu={onContextMenu}>
          {children}
        </Table.Row>
      )}
    </ContextMenu>
  );
};

export default Row;
