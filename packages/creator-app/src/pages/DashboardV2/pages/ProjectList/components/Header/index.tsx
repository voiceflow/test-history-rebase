import { Button } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import { usePermission } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { ImportButton } from '@/pages/Dashboard/Header/components';

import * as S from '../../../../components/Header/styles';
import { NotificationButton, SearchButton } from './components';
import { IconButtonContainer } from './styles';

interface HeaderProps {
  onSearch: (text: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const workspaceMembers = ModalsV2.useModal(ModalsV2.Workspace.Members);
  const projectCreateModal = ModalsV2.useModal(ModalsV2.Project.Create);
  const [canImportProject] = usePermission(Permission.IMPORT_PROJECT);
  const [canInviteMembers] = usePermission(Permission.INVITE);
  const [canCreateProject] = usePermission(Permission.EDIT_PROJECT);

  return (
    <S.HeaderContainer style={{ paddingLeft: '32px' }}>
      <S.Title>All Assistants</S.Title>
      <S.RightSection>
        <SearchButton onSearch={onSearch} />

        {canImportProject && (
          <IconButtonContainer>
            <ImportButton dashboardV2 />
          </IconButtonContainer>
        )}

        <IconButtonContainer style={{ marginRight: '12px' }}>
          <NotificationButton />
        </IconButtonContainer>

        {canInviteMembers && (
          <div style={{ marginRight: '10px' }}>
            <Button variant={Button.Variant.SECONDARY} squareRadius onClick={() => workspaceMembers.openVoid()}>
              Invite
            </Button>
          </div>
        )}

        {canCreateProject && (
          <Button variant={Button.Variant.PRIMARY} squareRadius onClick={() => projectCreateModal.openVoid({})}>
            New Assistant
          </Button>
        )}
      </S.RightSection>
    </S.HeaderContainer>
  );
};

export default Header;
