import TippyTooltip from '@ui/components/TippyTooltip';
import dayjs from 'dayjs';
import React from 'react';

import Row from './Row';
import { Member } from './types';

interface ListProps<M extends Member> {
  inset?: boolean;
  roles?: M['role'][];
  members: M[];
  onRemove?: (member: M) => void;
  showBadge?: boolean;
  onChangeRole?: (member: M, role: M['role']) => void;
  currentUserID?: number;
  canChangeRole?: boolean;
  onResendInvite?: (member: M) => void;
  hideLastDivider?: boolean;
}

const List = <M extends Member>({
  inset,
  roles,
  members,
  onRemove,
  showBadge,
  onChangeRole,
  currentUserID,
  onResendInvite,
  hideLastDivider = true,
  canChangeRole = false,
}: ListProps<M>): React.ReactElement => {
  const now = new Date();

  return (
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
          canChangeRole={canChangeRole}
          isCurrentUser={currentUserID !== undefined && member.creator_id === currentUserID}
          onResendInvite={!member.creator_id && onResendInvite ? () => onResendInvite(member) : undefined}
          showBadge={showBadge}
          warningTooltip={
            member.expiry && dayjs(member.expiry).isBefore(now)
              ? {
                  width: 232,
                  placement: 'bottom',
                  content: <TippyTooltip.Multiline>The invitation has expired. Please resend the invite to the user.</TippyTooltip.Multiline>,
                }
              : null
          }
        />
      ))}
    </div>
  );
};

export default List;
