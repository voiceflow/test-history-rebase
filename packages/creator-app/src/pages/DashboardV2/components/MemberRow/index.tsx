/* eslint-disable no-nested-ternary */
import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Avatar, Badge } from '@voiceflow/ui';
import React from 'react';

import RoleSelect from '../RoleSelect';
import * as S from './styles';

interface MemberRowProps {
  inset?: boolean;
  member: Realtime.WorkspaceMember | Realtime.PendingWorkspaceMember;
  border?: boolean;
  onRemove?: VoidFunction;
  onChangeRoles?: (roles: UserRole[]) => void;
  onResendInvite?: VoidFunction;
}

const ROLES = new Set([UserRole.ADMIN, UserRole.OWNER]);

const MemberRow: React.FC<MemberRowProps> = ({ member, inset, border, onRemove, onChangeRoles, onResendInvite }) => {
  return (
    <S.Row key={member.email} inset={inset} border={border}>
      <Avatar large text={member.name || member.email} image={member.image} />

      <S.Info>
        <S.Name>
          {member.name ?? member.email}

          {!member.creator_id ? (
            <Badge.Descriptive ml={8} color="gray">
              Pending
            </Badge.Descriptive>
          ) : ROLES.has(member.role) ? (
            <Badge.Descriptive ml={8}>{member.role}</Badge.Descriptive>
          ) : null}
        </S.Name>

        <S.Email>{member.name ? member.email : 'Invitation pending'}</S.Email>
      </S.Info>

      {!!onChangeRoles && <RoleSelect roles={[member.role]} onRemove={onRemove} onChange={onChangeRoles} onResendInvite={onResendInvite} />}
    </S.Row>
  );
};

export default MemberRow;
