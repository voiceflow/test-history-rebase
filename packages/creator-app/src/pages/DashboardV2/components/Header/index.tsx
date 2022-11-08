import { Button } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

const Header: React.FC = () => {
  return (
    <S.HeaderWrapper>
      <S.SidebarHeader>Acme Corp</S.SidebarHeader>
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
