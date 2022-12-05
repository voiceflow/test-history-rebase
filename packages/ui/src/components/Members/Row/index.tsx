/* eslint-disable no-nested-ternary */
import Avatar from '@ui/components/Avatar';
import Badge from '@ui/components/Badge';
import { UserRole } from '@voiceflow/internal';
import React from 'react';

import RoleSelect from '../RoleSelect';
import { Member } from '../types';
import * as S from './styles';

interface MemberRowProps {
  inset?: boolean;
  member: Member;
  border?: boolean;
  onRemove?: VoidFunction;
  onChangeRoles?: (roles: UserRole[]) => void;
  onResendInvite?: VoidFunction;
}

const ROLES = new Set([UserRole.ADMIN, UserRole.OWNER]);

const MemberRow: React.FC<MemberRowProps> = ({ member, inset, border, onRemove, onChangeRoles, onResendInvite }) => (
  <S.Container inset={inset} border={border}>
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

    {!!onChangeRoles && (
      <S.RoleSelectContainer>
        <RoleSelect roles={[member.role]} onRemove={onRemove} onChange={onChangeRoles} onResendInvite={onResendInvite} />
      </S.RoleSelectContainer>
    )}
  </S.Container>
);

export default MemberRow;
