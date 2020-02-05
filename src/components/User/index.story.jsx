import { action } from '@storybook/addon-actions';
import React from 'react';

import User, { Members } from '.';

const MEMBERS = [
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
    image: 'https://picsum.photos/200',
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

export const user = () => <User user={MEMBERS[0]} />;

export const solidUser = () => <User user={MEMBERS[0]} solid />;

export const largeUser = () => <User user={MEMBERS[0]} large />;

export const members = () => <Members members={MEMBERS} />;

export const membersWithAdd = () => <Members members={MEMBERS} onAdd={action('onAddClick')} />;
