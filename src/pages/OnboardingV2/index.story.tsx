import React from 'react';

import { UserRole } from '@/constants';

import { Onboarding } from '.';

export default {
  title: 'Creator/Steps/If Step',
  component: Onboarding,
};

const getProps = () => ({
  data: { email: 'abc@test.com', permission: UserRole.ADMIN },
});

export const normal = () => {
  return <Onboarding {...getProps()} />;
};
