import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';
import { MODALS } from '@/constants';
import { useModals } from '@/contexts/ModalsContext';

import { BoardDeleteModal } from '.';

const workspace = {
  id: 1,
  name: 'name',
  status: 0,
  creatorID: 1,
};

storiesOf('Dashboard/Board Delete Modal', module).add(
  'variants',
  createTestableStory(() => {
    const { isOpened, open } = useModals(MODALS.BOARD_DELETE);

    !isOpened && open();

    return (
      <Variant>
        <BoardDeleteModal workspace={workspace} deleteWorkspace={action('deleteWorkspace')} />
      </Variant>
    );
  })
);
