import React from 'react';

import { useActiveWorkspace } from '@/hooks';

import { AssistantHeader, WorkspaceSelector } from './components';
import * as S from './styles';

const Header: React.FC = () => {
  const workspace = useActiveWorkspace();

  return (
    <S.HeaderWrapper>
      <WorkspaceSelector activeWorkspace={workspace} />
      <AssistantHeader onSearch={() => {}} />
    </S.HeaderWrapper>
  );
};

export default Header;
