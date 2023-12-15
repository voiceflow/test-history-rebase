import { Table, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import * as Account from '@/ducks/account';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/store.hook';

export const ImportedByName: React.FC<{
  creatorID: number;
}> = ({ creatorID }) => {
  const user = useSelector(Account.userIDSelector);
  const member = useSelector(WorkspaceV2.active.memberByIDSelector, { creatorID });

  return !member ? (
    <Table.Cell.Empty />
  ) : (
    <Tooltip.Overflow
      referenceElement={({ ref, onOpen, onClose }) => (
        <Table.Cell.Text label={creatorID === user ? 'You' : member.name} ref={ref} overflow onMouseEnter={onOpen} onMouseLeave={onClose} />
      )}
    >
      {() => <Text breakWord>{creatorID === user ? 'You' : member.name}</Text>}
    </Tooltip.Overflow>
  );
};
