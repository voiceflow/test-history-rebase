import React from 'react';

import { composeDecorators, withRedux } from '@/../.storybook';
import { UserRole } from '@/constants';

import { Onboarding } from '.';

const withDecorators = composeDecorators(
  withRedux({
    creator: {},
  })
);

export default {
  title: 'Creator/Steps/If Step',
  component: Onboarding,
};

const getProps = () => ({
  data: { collaborators: [{ email: 'abc@test.com', permission: UserRole.ADMIN }] },
});

export const normal = withDecorators(() => {
  return <Onboarding {...getProps()} />;
});
