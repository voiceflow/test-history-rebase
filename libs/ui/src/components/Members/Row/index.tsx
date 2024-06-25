import Avatar from '@ui/components/Avatar';
import Badge from '@ui/components/Badge';
import Box from '@ui/components/Box';
import { PROFILE_COLORS } from '@ui/styles/colors';
import { getStringHashNumber } from '@ui/utils/string';
import type { Nullable } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';
import { UserRole } from '@voiceflow/dtos';
import React from 'react';

import RoleSelect from '../RoleSelect';
import type { Member } from '../types';
import * as S from './styles';

interface MemberRowProps<M extends Member> {
  roles?: M['role'][];
  inset?: boolean;
  member: M;
  border?: boolean;
  onRemove?: VoidFunction;
  showBadge?: boolean;
  infoTooltip?: React.ReactNode;
  onChangeRole: Nullable<(role: M['role']) => void>;
  canEditOwner?: boolean;
  pendingLabel?: React.ReactNode;
  isCurrentUser?: boolean;
  onResendInvite?: VoidFunction | null;
}

const MemberRow = <T extends Member>({
  roles,
  member,
  inset,
  border,
  onRemove,
  showBadge = true,
  infoTooltip,
  pendingLabel = 'Invitation pending',
  canEditOwner,
  onChangeRole,
  isCurrentUser,
  onResendInvite,
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
        <S.NameContainer>
          <S.Name>{member.name ?? member.email}</S.Name>
          {showBadge && (
            <>
              {!member.creator_id ? (
                <Badge.Descriptive ml={8} color="gray">
                  Pending
                </Badge.Descriptive>
              ) : (
                (member.role === UserRole.ADMIN || member.isOrganizationAdmin) && (
                  <Badge.Descriptive ml={8}>{member.isOrganizationAdmin ? 'Owner' : 'Admin'}</Badge.Descriptive>
                )
              )}
            </>
          )}
        </S.NameContainer>

        <S.Email>{member.name ? member.email : pendingLabel}</S.Email>
      </S.Info>

      <Box.Flex flexShrink={0}>
        {infoTooltip}

        <S.RoleSelectContainer>
          <RoleSelect
            roles={roles}
            value={member.role}
            label={member.isOrganizationAdmin ? 'Owner' : undefined}
            onRemove={member.isOrganizationAdmin && !canEditOwner ? null : onRemove}
            onChange={onChangeRole ?? Utils.functional.noop}
            isInvite={!member.creator_id}
            disabled={!onChangeRole || isCurrentUser || (member.isOrganizationAdmin && !canEditOwner)}
            onResendInvite={onResendInvite}
          />
        </S.RoleSelectContainer>
      </Box.Flex>
    </S.Container>
  );
};

export default MemberRow;
