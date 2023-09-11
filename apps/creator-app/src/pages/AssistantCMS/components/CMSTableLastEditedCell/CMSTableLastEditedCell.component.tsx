import { Table, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/store.hook';

import type { ICMSTableLastEdited } from './CMSTableLastEditedCell.interface';

export const CMSTableLastEditedCell: React.FC<ICMSTableLastEdited> = ({ creatorID }) => {
  const member = useSelector(WorkspaceV2.active.memberByIDSelector, { creatorID });

  return !member ? (
    <Table.Cell.Empty />
  ) : (
    <Tooltip.Overflow
      referenceElement={({ ref, onOpen, onClose }) => (
        <Table.Cell.Text ref={ref} onMouseEnter={onOpen} onMouseLeave={onClose} label={member.name} overflow />
      )}
    >
      {() => <Text breakWord>{member.name}</Text>}
    </Tooltip.Overflow>
  );
};
