import React from 'react';

import { UserMenu } from '.';

export default {
  title: 'Header/User Menu',
  component: UserMenu,
};

export const normal = () => <UserMenu user={{ creator_id: '123' }} />;
