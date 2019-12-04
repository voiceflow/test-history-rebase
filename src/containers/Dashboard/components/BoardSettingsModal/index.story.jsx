import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';
import { MODALS } from '@/constants';
import { useModals } from '@/contexts/ModalsContext';

import { BoardSettingsModal } from '.';

const workspace = {
  id: 1,
  name: 'name',
  status: 0,
  creatorID: 1,
};

storiesOf('Dashboard/Board Settings Modal', module)
  .add(
    'User is not admin',
    createTestableStory(() => {
      const { isOpened, open } = useModals(MODALS.BOARD_SETTINGS);

      !isOpened && open();

      return (
        <Variant>
          <BoardSettingsModal user={{ creator_id: 0 }} workspace={workspace} />
        </Variant>
      );
    })
  )
  .add(
    'User is admin',
    createTestableStory(() => {
      const { isOpened, open } = useModals(MODALS.BOARD_SETTINGS);

      !isOpened && open();

      return (
        <Variant>
          <BoardSettingsModal user={{ creator_id: workspace.creatorID }} workspace={workspace} updateWorkspaceName={action('updateWorkspaceName')} />
        </Variant>
      );
    })
  )
  .add(
    'With icon',
    createTestableStory(() => {
      const { isOpened, open } = useModals(MODALS.BOARD_SETTINGS);

      !isOpened && open();

      return (
        <Variant>
          <BoardSettingsModal
            user={{ creator_id: workspace.creatorID }}
            workspace={{ ...workspace, status: 1, image: '/images/img.png' }}
            updateWorkspaceName={action('updateWorkspaceName')}
          />
        </Variant>
      );
    })
  );
