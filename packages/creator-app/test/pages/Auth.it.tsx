import { act, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { SignupForm } from '@/pages/Auth/components/SignupForm';
import * as hooks from '@/pages/Auth/hooks';

import suite from '../_suite';
import { composeWrappers, StoreProvider, ThemeProvider } from '../_utils';

const TEST_NAME = 'Voiceflow Tester';
const TEST_EMAIL = 'tests@getvoiceflow.com';
const TEST_PASSWORD = 'password';

suite('Auth', () => {
  const TestWrapper = composeWrappers(ThemeProvider, StoreProvider);

  beforeEach(() => {
    vi.mock('@/client');
    vi.mock('react-ga');
    vi.mock('universal-cookie');
    vi.mock('connected-react-router', () => ({ getSearch: () => ({}) }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Onboarding', () => {
    it('creates accounts on signup', async () => {
      const signup = vi.fn();

      vi.spyOn(hooks, 'getDomainSAML').mockResolvedValue(null);

      const utils = render(<SignupForm query={{}} search="" signup={signup} goToLogin={vi.fn()} />, { wrapper: TestWrapper });

      await userEvent.type(utils.getByPlaceholderText('Full name'), TEST_NAME);
      await userEvent.type(utils.getByPlaceholderText('Email address'), TEST_EMAIL);
      await userEvent.type(utils.getByPlaceholderText('Password'), TEST_PASSWORD);

      await act(async () => {
        await fireEvent.submit(document.getElementsByTagName('form')[0]);
      });

      expect(signup.mock.calls[0]).toEqual([
        {
          name: TEST_NAME,
          email: TEST_EMAIL,
          password: TEST_PASSWORD,
          coupon: '',
          urlSearch: '',
          referralCode: undefined,
          referralRockCode: undefined,
        },
      ]);
    });
  });
});
