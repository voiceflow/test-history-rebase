import { UserRole } from '@voiceflow/internal';
import React from 'react';

import Row from './Row';
import { Member } from './types';

interface ListProps<M extends Member> {
  inset?: boolean;
  members: M[];
  onRemove?: (member: M) => void;
  onChangeRoles?: (member: M, roles: UserRole[]) => void;
  onResendInvite?: (member: M) => void;
  hideLastDivider?: boolean;
}

const List = <M extends Member>({
  inset,
  members,
  onRemove,
  onChangeRoles,
  onResendInvite,
  hideLastDivider = true,
}: ListProps<M>): React.ReactElement => (
  <div>
    {members.map((member, index) => (
      <Row
        key={member.email}
        inset={inset}
        border={hideLastDivider ? index + 1 !== members.length : true}
        member={member}
        onRemove={onRemove && (() => onRemove(member))}
        onChangeRoles={onChangeRoles && ((roles) => onChangeRoles(member, roles))}
        onResendInvite={!member.creator_id && onResendInvite ? () => onResendInvite(member) : undefined}
      />
    ))}
  </div>
);

export default List;
