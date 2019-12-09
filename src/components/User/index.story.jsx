import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';

import User, { Members } from '.';

const members = [
  {
    name: 'Local User',
    email: 'local@voiceflow.com',
    role: 'admin',
    image: 'F86683|FEF2F4',
    creator_id: 1,
    seats: 10,
    created: null,
  },
  {
    name: 'Admin User',
    email: 'admin@voiceflow.com',
    role: 'admin',
    image: '5891FB|EFF5FF',
    creator_id: 2,
    seats: 10,
    created: null,
  },
  {
    name: 'Test Member',
    email: 'test@voiceflow.com',
    role: 'admin',
    image: '697986|EEF0F1',
    creator_id: 3,
    seats: 10,
    created: null,
  },
  {
    name: null,
    email: 'member@gmail.com',
    role: 'editor',
    image: null,
    creator_id: null,
    seats: 10,
    created: '1575545218',
  },
];

storiesOf('User', module)
  .add(
    'variants - User',
    createTestableStory(() => {
      return (
        <>
          <Variant>
            <User user={members[0]} />
          </Variant>

          <Variant label="solid">
            <User user={members[0]} solid />
          </Variant>

          <Variant label="large">
            <User user={members[0]} large />
          </Variant>
        </>
      );
    })
  )
  .add(
    'variants - Members',
    createTestableStory(() => {
      return (
        <>
          <Variant>
            <Members members={members} />
          </Variant>

          <Variant label="with add">
            <Members members={members} onAdd={action('onAddClick')} />
          </Variant>
        </>
      );
    })
  );
