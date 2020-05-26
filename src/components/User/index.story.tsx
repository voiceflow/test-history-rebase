import { action } from '@storybook/addon-actions';
import React from 'react';

import { LockOwner } from '@/models';
import { noop } from '@/utils/functional';

import User, { Members } from '.';

const MEMBERS = [
  {
    name: 'Local User',
    email: 'local@voiceflow.com',
    image: 'F86683|FEF2F4',
    creator_id: 1,
    created: '1575545218',
  },
  {
    name: 'Admin User',
    email: 'admin@voiceflow.com',
    image: 'https://picsum.photos/200',
    creator_id: 2,
    created: '1575545218',
  },
  {
    name: 'Test Member',
    email: 'test@voiceflow.com',
    image: '697986|EEF0F1',
    creator_id: 3,
    created: '1575545218',
  },
  {
    name: null,
    email: 'member@gmail.com',
    image: null,
    creator_id: null,
    created: '1575545218',
  },
] as LockOwner[];

export const user = () => <User user={MEMBERS[0]} />;

export const solidUser = () => <User user={MEMBERS[0]} solid />;

export const largeUser = () => <User user={MEMBERS[0]} large />;

export const members = () => <Members onAdd={noop} members={MEMBERS} />;

export const membersWithAdd = () => <Members members={MEMBERS} onAdd={action('onAddClick')} />;
