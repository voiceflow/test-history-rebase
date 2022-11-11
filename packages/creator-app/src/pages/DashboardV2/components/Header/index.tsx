import { Button } from '@voiceflow/ui';
import React from 'react';

import { useActiveWorkspace } from '@/hooks';

import { WorkspaceSelector } from './components';
import * as S from './styles';

const Header: React.FC = () => {
  const workspace = useActiveWorkspace();

  return (
    <S.HeaderWrapper>
      <WorkspaceSelector activeWorkspace={workspace} />
      <S.WorkspaceActions>
        <S.Title>All Assistants</S.Title>
        <S.Actions>
          <Button style={{ marginRight: 10 }} variant={Button.Variant.SECONDARY} squareRadius>
            Invite
          </Button>
          <Button squareRadius>New Assistant</Button>
        </S.Actions>
      </S.WorkspaceActions>
    </S.HeaderWrapper>
  );
};

export default Header;
