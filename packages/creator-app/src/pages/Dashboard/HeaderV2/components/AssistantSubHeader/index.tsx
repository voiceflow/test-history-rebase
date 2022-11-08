import * as Realtime from '@voiceflow/realtime-sdk';
import { Members } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import { usePermission } from '@/hooks';

import { HeaderContainer, RightSection, Title } from '../../styles';
import { BackButton } from './components';

interface AssistantSubHeaderProps {
  workspace: Realtime.Workspace;
  title: string;
  onBackButtonClick: VoidFunction;
}

const AssistantSubHeader: React.FC<AssistantSubHeaderProps> = ({ workspace, title, onBackButtonClick }) => {
  const [canViewMembers] = usePermission(Permission.VIEW_COLLABORATORS);

  return (
    <HeaderContainer>
      <BackButton onClick={onBackButtonClick} />
      <Title>{title}</Title>
      <RightSection>{canViewMembers && <Members members={workspace.members} />}</RightSection>
    </HeaderContainer>
  );
};

export default AssistantSubHeader;
