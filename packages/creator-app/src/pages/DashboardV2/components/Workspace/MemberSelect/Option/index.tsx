import * as Realtime from '@voiceflow/realtime-sdk';
import { Avatar, Box } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

interface WorkspaceMemberSelectOptionProps {
  option: Realtime.WorkspaceMember;
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
