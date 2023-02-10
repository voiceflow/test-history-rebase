import React from 'react';

import Row from './Row';
import { Member } from './types';

interface ListProps<M extends Member> {
  inset?: boolean;
  roles?: M['role'][];
  members: M[];
  onRemove?: (member: M) => void;
  onChangeRole?: (member: M, role: M['role']) => void;
  currentUserID?: number;
  onResendInvite?: (member: M) => void;
  hideLastDivider?: boolean;
  canChangeRole?: boolean;
}

const List = <M extends Member>({
  inset,
  roles,
  members,
  onRemove,
  onChangeRole,
  currentUserID,
  onResendInvite,
  hideLastDivider = true,
  canChangeRole = false,
}: ListProps<M>): React.ReactElement => (
  <div>
    {members.map((member, index) => (
      <Row
        key={member.email}
        inset={inset}
        roles={roles}
        border={hideLastDivider ? index + 1 !== members.length : true}
        member={member}
        onRemove={onRemove && (() => onRemove(member))}
        onChangeRole={onChangeRole && ((role) => onChangeRole(member, role))}
        isCurrentUser={currentUserID !== undefined && member.creator_id === currentUserID}
        onResendInvite={!member.creator_id && onResendInvite ? () => onResendInvite(member) : undefined}
        canChangeRole={canChangeRole}
      />
    ))}
  </div>
);

export default List;
