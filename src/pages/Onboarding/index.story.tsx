import { composeDecorators, withRedux } from '_storybook';
import React from 'react';

import { UserRole } from '@/constants';

import { Onboarding } from '.';
import { OnboardingType } from './context/types';

export default {
  title: 'Onboarding',
  component: Onboarding,
};

const withDecorators = composeDecorators(withRedux({}));

const getProps = () => ({
  data: { collaborators: [{ email: 'abc@test.com', permission: UserRole.ADMIN }] },
});

export const createWorkspace = withDecorators(() => <Onboarding {...getProps()} />);

export const joinWorkspace = withDecorators(() => <Onboarding {...getProps()} location={{ search: `flow=${OnboardingType.join}` }} />);
