import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { composeWrappers, StoreProvider, ThemeProvider } from '@/../test/_utils';
import { SignupForm } from '@/pages/Auth/components/SignupForm';
import * as hooks from '@/pages/Auth/hooks';

const TEST_NAME = 'Voiceflow Tester';
const TEST_EMAIL = 'tests@getvoiceflow.com';
const TEST_PASSWORD = 'password';

require('dotenv').config({ path: './.env.test' });

const TestWrapper = composeWrappers(ThemeProvider, StoreProvider);

beforeEach(() => {
  jest.mock('@/client');
  jest.mock('react-ga');
  jest.mock('universal-cookie');
  jest.mock('connected-react-router');
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Onboarding', () => {
  it('creates accounts on signup', async () => {
    const signup = jest.fn();
    jest.spyOn(hooks, 'getDomainSAML').mockResolvedValue(null);

    render(<SignupForm query={{}} search="" signup={signup} goToLogin={jest.fn()} />, { wrapper: TestWrapper });

    fireEvent.change(screen.getByPlaceholderText('Full name'), { target: { value: TEST_NAME } });
    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: TEST_EMAIL } });
    fireEvent.change(document.querySelector('[type="password"]')!, { target: { value: TEST_PASSWORD } });

    await act(async () => {
      await fireEvent.submit(document.getElementsByTagName('form')[0]);
    });

    expect(signup).toBeCalledWith({
      name: TEST_NAME,
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      coupon: '',
      referralCode: undefined,
      urlSearch: '',
    });
  });
});
