import { Members } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import { Permission } from '@/constants/permissions';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useDispatch, usePermission, useSelector } from '@/hooks';

import { WorkspaceSelector } from '../../../components';

const Header: React.FC = () => {
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);

  const projectName = useSelector(ProjectV2.active.nameSelector);
  const allViewers = useSelector(ProjectV2.active.allAwarenessViewersSelector);

  const goToWorkspace = useDispatch(Router.goToWorkspace);

  const [canViewMembers] = usePermission(Permission.VIEW_COLLABORATORS);

  return (
    <Page.Header>
      <WorkspaceSelector />

      <Page.Header.InlineBackButton onClick={() => workspaceID && goToWorkspace(workspaceID)} />

      <Page.Header.Title>{projectName}</Page.Header.Title>

      {canViewMembers && (
        <Page.Header.RightSection>
          <Members.AvatarList members={allViewers} />
        </Page.Header.RightSection>
      )}
    </Page.Header>
  );
};

export default Header;
