import React from 'react';

import Box from '@/components/Box';

import ConditionsBuilder from '.';

const getProps: any = () => {};

export default {
  title: 'Commenter',
  component: ConditionsBuilder,
};

export const basic = () => (
  <Box m={30}>
    <ConditionsBuilder {...getProps()} />
  </Box>
);
