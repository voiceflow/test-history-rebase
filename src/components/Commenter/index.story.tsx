import React from 'react';

import Box from '@/components/Box';
import { UserRole } from '@/constants';

import { Commenter } from '.';

const USER = {
  creator_id: 2,
  name: 'Michael Scott',
  email: 'michael.scott@dundermifflin.com',
  role: UserRole.EDITOR,
  image: '5891FB|EFF5FF',
};

const getProps: any = () => ({ user: USER });

export default {
  title: 'Commenter',
  component: Commenter,
};

export const basic = () => (
  <Box m={30}>
    <Commenter {...getProps()} />
  </Box>
);

export const withTime = () => (
  <Box m={30}>
    <Commenter {...getProps()} time="2020-07-02T18:07:31.215Z" />
  </Box>
);

export const longName = () => (
  <Box m={30}>
    <Commenter {...({ user: { ...USER, name: 'Michael Anderson Scott' } } as any)} time="2020-07-02T18:07:31.215Z" />
  </Box>
);
