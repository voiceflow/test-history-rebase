import TippyTooltip from '@ui/components/TippyTooltip';
import type { Nullable } from '@voiceflow/common';
import type { UserRole } from '@voiceflow/dtos';
import dayjs from 'dayjs';
import React from 'react';

import Row from './Row';
import RowProjectsTooltip from './RowProjectsTooltip';
import RowWarningTooltip from './RowWarningTooltip';
import type { Member } from './types';

interface ListProps<M extends Member> {
  inset?: boolean;
  roles?: M['role'][];
  members: M[];
  onRemove?: (member: M) => void;
  showBadge?: boolean;
  isEditorRole: (role: UserRole) => boolean;
  onChangeRole: Nullable<(member: M, role: M['role']) => void>;
  canEditOwner?: boolean;
  currentUserID?: number;
  onResendInvite?: (member: M) => void;
  hideLastDivider?: boolean;
  renderPendingLabel?: (member: M) => React.ReactNode;
}

const List = <M extends Member>({
  inset,
  roles,
  members,
  onRemove,
  showBadge,
  onChangeRole,
  isEditorRole,
  canEditOwner = false,
  currentUserID,
  onResendInvite,
  hideLastDivider = true,
  renderPendingLabel,
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
        showBadge={showBadge}
        infoTooltip={
          member.expiry && dayjs(member.expiry).isBefore(new Date()) ? (
            <RowWarningTooltip width={232} placement="bottom">
              <TippyTooltip.Multiline>
                The invitation has expired. Please resend the invite to the user.
              </TippyTooltip.Multiline>
            </RowWarningTooltip>
          ) : (
            <RowProjectsTooltip member={member} isEditorRole={isEditorRole} />
          )
        }
        pendingLabel={renderPendingLabel?.(member)}
        onChangeRole={onChangeRole ? (role) => onChangeRole(member, role) : null}
        canEditOwner={canEditOwner}
        isCurrentUser={currentUserID !== undefined && member.creator_id === currentUserID}
        onResendInvite={!member.creator_id && onResendInvite ? () => onResendInvite(member) : null}
      />
    ))}
  </div>
);

export default List;
