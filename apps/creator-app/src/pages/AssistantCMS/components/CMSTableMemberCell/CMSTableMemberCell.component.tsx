import { Table, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import * as Account from '@/ducks/account';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/store.hook';

import type { ICMSTableMemberCell } from './CMSTableMemberCell.interface';

export const CMSTableMemberCell: React.FC<ICMSTableMemberCell> = ({ creatorID }) => {
  const member = useSelector(WorkspaceV2.active.members.memberByIDSelector, { creatorID });
  const userID = useSelector(Account.userIDSelector);

  if (userID === creatorID) return <Table.Cell.Text label="You" overflow />;

  return !member ? (
    <Table.Cell.Empty />
  ) : (
    <Tooltip.Overflow
      referenceElement={({ ref, onOpen, onClose }) => (
        <Table.Cell.Text ref={ref} onMouseEnter={onOpen} onMouseLeave={onClose} label={member.name} overflow />
      )}
    >
      {() => (
        <Text variant="caption" breakWord>
          {member.name}
        </Text>
      )}
    </Tooltip.Overflow>
  );
};
