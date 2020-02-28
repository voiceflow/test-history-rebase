import React from 'react';

import { composeDecorators, withDnD, withRedux } from '@/../.storybook';
import { USER_ROLES } from '@/constants';
import { RolePermissionsProvider } from '@/contexts/RolePermissionsContext';
import { EditPermissionProvider } from '@/pages/Canvas/contexts';

import LeftSidebar from '.';

export default {
  title: 'Creator/Left Sidebar',
  component: LeftSidebar,
};

const createStory = ({ userId = 1, platform = null } = {}) =>
  composeDecorators(
    withDnD,
    withRedux({
      account: { creator_id: userId },
      skill: {
        platform,
      },
      workspace: {
        byId: { 1: { members: [{ creator_id: 1, role: USER_ROLES.ADMIN }] } },
        allIDs: [1],
        activeWorkspaceID: 1,
      },
    }),
    (Component) => (
      <div style={{ width: '400px', height: '100vh', minHeight: '500px', position: 'relative', overflow: 'hidden' }}>
        <RolePermissionsProvider>
          <EditPermissionProvider>
            <Component />
          </EditPermissionProvider>
        </RolePermissionsProvider>
      </div>
    )
  );

export const base = createStory()(() => <LeftSidebar />);
export const cantEdit = createStory({ userId: 0 })(() => <LeftSidebar />);
export const stepsAlexa = createStory({ platform: 'alexa' })(() => <LeftSidebar />);
export const stepsGoogle = createStory({ platform: 'google' })(() => <LeftSidebar />);
