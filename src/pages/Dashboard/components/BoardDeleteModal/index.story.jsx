import { action } from '@storybook/addon-actions';
import React from 'react';

import { withModalContext } from '@/../.storybook';
import { ModalType } from '@/constants';

import { BoardDeleteModal } from '.';

const WORKSPACE = {
  id: 1,
  name: 'name',
  status: 0,
  creatorID: 1,
};

export default {
  title: 'Dashboard/Delete Workspace Modal',
  component: BoardDeleteModal,
  includeStories: [],
};

const withDecorators = withModalContext(ModalType.BOARD_DELETE);

export const normal = withDecorators(() => <BoardDeleteModal workspace={WORKSPACE} deleteWorkspace={action('deleteWorkspace')} />);
