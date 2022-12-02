import Avatar from '@ui/components/Avatar';
import Box from '@ui/components/Box';
import React from 'react';
import { DeepNonNullable } from 'utility-types';

import { Member } from '../../types';
import * as S from './styles';

interface WorkspaceMemberSelectOptionProps {
  option: DeepNonNullable<Member>;
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
