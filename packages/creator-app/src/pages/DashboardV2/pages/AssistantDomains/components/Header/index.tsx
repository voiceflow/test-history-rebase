import * as Realtime from '@voiceflow/realtime-sdk';
import { Members } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import { usePermission } from '@/hooks';

import * as S from '../../../../components/Header/styles';
import { BackButton } from './components';

interface HeaderProps {
  workspace: Realtime.Workspace;
  title: string;
  onBackButtonClick: VoidFunction;
}

const Header: React.FC<HeaderProps> = ({ workspace, title, onBackButtonClick }) => {
  const [canViewMembers] = usePermission(Permission.VIEW_COLLABORATORS);

  return (
    <S.HeaderContainer>
      <BackButton onClick={onBackButtonClick} />
      <S.Title>{title}</S.Title>
      <S.RightSection>{canViewMembers && <Members members={workspace.members} />}</S.RightSection>
    </S.HeaderContainer>
  );
};

export default Header;
