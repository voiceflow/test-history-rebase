/* eslint-disable no-nested-ternary */
import Avatar from '@ui/components/Avatar';
import Badge from '@ui/components/Badge';
import Box from '@ui/components/Box';
import SvgIcon from '@ui/components/SvgIcon';
import TippyTooltip, { TippyTooltipProps } from '@ui/components/TippyTooltip';
import { PROFILE_COLORS } from '@ui/styles/colors';
import { getStringHashNumber } from '@ui/utils/string';
import { UserRole } from '@voiceflow/internal';
import React from 'react';

import RoleSelect from '../RoleSelect';
import { Member } from '../types';
import * as S from './styles';

interface MemberRowProps<M extends Member> {
  roles?: M['role'][];
  inset?: boolean;
  member: M;
  border?: boolean;
  onRemove?: VoidFunction;
  onChangeRole?: (role: M['role']) => void;
  canChangeRole?: boolean;
  isCurrentUser?: boolean;
  onResendInvite?: VoidFunction;
  warningTooltip?: TippyTooltipProps | null;
}

const BADGE_ROLES = new Set([UserRole.ADMIN, UserRole.OWNER]);

const MemberRow = <T extends Member>({
  roles,
  member,
  inset,
  border,
  onRemove,
  onChangeRole,
  canChangeRole,
  isCurrentUser,
  onResendInvite,
  warningTooltip,
}: MemberRowProps<T>) => {
  const memberImage = React.useMemo(() => {
    if (member.image) return member.image;

    const emailHash = getStringHashNumber(member.email);

    return PROFILE_COLORS[emailHash % PROFILE_COLORS.length];
  }, [member.image, member.email]);

  return (
    <S.Container inset={inset} border={border}>
      <Avatar large text={member.name || member.email} image={memberImage} />

      <S.Info>
        <S.Name>
          {member.name ?? member.email}

          {!member.creator_id ? (
            <Badge.Descriptive ml={8} color="gray">
              Pending
            </Badge.Descriptive>
          ) : BADGE_ROLES.has(member.role) ? (
            <Badge.Descriptive ml={8}>{member.role}</Badge.Descriptive>
          ) : null}
        </S.Name>

        <S.Email>{member.name ? member.email : 'Invitation pending'}</S.Email>
      </S.Info>

      <Box.Flex>
        {!!warningTooltip && (
          <TippyTooltip {...warningTooltip}>
            <SvgIcon icon="warning" color="#BD425F" clickable />
          </TippyTooltip>
        )}

        {!!onChangeRole && (
          <S.RoleSelectContainer>
            <RoleSelect
              roles={roles}
              value={member.role}
              onRemove={onRemove}
              onChange={onChangeRole}
              isInvite={!member.creator_id}
              disabled={isCurrentUser || !canChangeRole}
              canChangeRole={canChangeRole && !isCurrentUser}
              onResendInvite={onResendInvite}
            />
          </S.RoleSelectContainer>
        )}
      </Box.Flex>
    </S.Container>
  );
};

export default MemberRow;
