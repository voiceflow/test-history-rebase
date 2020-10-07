import React from 'react';

import { composeDecorators, withRedux } from '@/../.storybook';
import { UserRole } from '@/constants';

import { OnboardingType } from './context/types';
import { Onboarding } from '.';

export default {
  title: 'Onboarding',
  component: Onboarding,
};

const withDecorators = composeDecorators(withRedux({}));

const getProps = () => ({
  data: { collaborators: [{ email: 'abc@test.com', permission: UserRole.ADMIN }] },
});

export const createWorkspace = withDecorators(() => {
  return <Onboarding {...getProps()} />;
});

export const joinWorkspace = withDecorators(() => {
  return <Onboarding {...getProps()} location={{ search: `flow=${OnboardingType.join}` }} />;
});
