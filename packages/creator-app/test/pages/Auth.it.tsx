import { act, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { SignupForm } from '@/pages/Auth/components/SignupForm';
import * as hooks from '@/pages/Auth/hooks';

import suite from '../_suite';
import { composeWrappers, StoreProvider, ThemeProvider } from '../_utils';

const TEST_FIRST_NAME = 'Michelle';
const TEST_LAST_NAME = 'Ream';
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

      await userEvent.type(utils.getByPlaceholderText('First name'), TEST_FIRST_NAME);
      await userEvent.type(utils.getByPlaceholderText('Last name'), TEST_LAST_NAME);
      await userEvent.type(utils.getByPlaceholderText('Email address'), TEST_EMAIL);
      await userEvent.type(utils.getByPlaceholderText('Password'), TEST_PASSWORD);

      await act(async () => {
        await fireEvent.submit(document.getElementsByTagName('form')[0]);
      });

      expect(signup.mock.calls[0]).toEqual([
        {
          name: `${TEST_FIRST_NAME} ${TEST_LAST_NAME}`,
          email: TEST_EMAIL,
          password: TEST_PASSWORD,
          coupon: '',
          urlSearch: '',
          referralCode: undefined,
          referralRockCode: undefined,
        },
        {
          query: {
            utm_first_name: TEST_FIRST_NAME,
            utm_last_name: TEST_LAST_NAME,
          },
        },
      ]);
    });
  });
});
