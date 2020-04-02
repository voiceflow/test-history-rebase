import { action } from '@storybook/addon-actions';
import React from 'react';

import { withModalContext } from '@/../.storybook';
import { ModalType } from '@/constants';

import { BoardSettingsModal } from '.';

const WORKSPACE = {
  id: 1,
  name: 'name',
  status: 0,
  creatorID: 1,
};

const withDecorators = withModalContext(ModalType.BOARD_SETTINGS);

export default {
  title: 'Dashboard/Workspace Settings Modal',
  component: BoardSettingsModal,
  includeStories: [],
};

export const admin = withDecorators(() => (
  <BoardSettingsModal user={{ creator_id: WORKSPACE.creatorID }} workspace={WORKSPACE} updateWorkspaceName={action('updateWorkspaceName')} />
));

export const notAdmin = withDecorators(() => <BoardSettingsModal user={{ creator_id: 0 }} workspace={WORKSPACE} />);

export const withIcon = withDecorators(() => (
  <BoardSettingsModal
    user={{ creator_id: WORKSPACE.creatorID }}
    workspace={{ ...WORKSPACE, status: 1, image: '/images/img.png' }}
    updateWorkspaceName={action('updateWorkspaceName')}
  />
));
