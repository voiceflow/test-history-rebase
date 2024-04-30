import React from 'react';
import type { DeepNonNullable } from 'utility-types';

import Avatar from '@/components/Avatar';
import Box from '@/components/Box';

import type { Member } from '../../types';
import * as S from './styles';

interface WorkspaceMemberSelectOptionProps extends React.PropsWithChildren {
  option: DeepNonNullable<Omit<Member, 'expiry' | 'isOrganizationAdmin'>>;
  isFocused?: boolean;
  searchLabel?: string | null;
}

const WorkspaceMemberSelectOption: React.FC<WorkspaceMemberSelectOptionProps> = ({ option, children }) => (
  <Box.Flex gap={16}>
    <Avatar image={option.image} text={option.name} large />

    <div>
      <S.Name>{children}</S.Name>
      <S.Email>{option.email}</S.Email>
    </div>
  </Box.Flex>
);

export default WorkspaceMemberSelectOption;
