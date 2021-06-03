import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import * as ReactRedux from 'react-redux';

import { noop } from '@/utils/functional';
import { ThemeProvider } from '@/utils/testing';

import { SignupForm } from '../components/SignupForm';

const TEST_NAME = 'Voiceflow Tester';
const TEST_EMAIL = 'tests@getvoiceflow.com';
const TEST_PASSWORD = 'password';

require('dotenv').config({ path: './.env.test' });

jest.mock('react-ga');
jest.mock('@/client');
jest.mock('universal-cookie');
jest.mock('connected-react-router');

const renderWithProviders = (jsx: JSX.Element) =>
  render(
    <ThemeProvider>
      <ReactRedux.Provider
        store={
          {
            getState: () => ({}),
            subscribe: () => noop,
            dispatch: noop,
            replaceReducer: noop,
          } as any
        }
      >
        {jsx}
      </ReactRedux.Provider>
    </ThemeProvider>
  );

afterEach(() => {
  jest.clearAllMocks();
});

describe('Onboarding', () => {
  it('creates accounts on signup', () => {
    const signup = jest.fn();
    renderWithProviders(<SignupForm query={{}} search="" signup={signup} goToLogin={jest.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('Full name'), { target: { value: TEST_NAME } });
    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: TEST_EMAIL } });
    fireEvent.change(document.querySelector('[type="password"]')!, { target: { value: TEST_PASSWORD } });

    act(() => {
      fireEvent.submit(document.getElementsByTagName('form')[0]);
    });

    expect(signup).toBeCalledWith({
      name: TEST_NAME,
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      coupon: '',
      referralCode: undefined,
    });
  });
});
