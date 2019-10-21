import * as ConnectedReactRouter from 'connected-react-router';
import { shallow } from 'enzyme/build';
import React from 'react';

import fetch from '@/client/fetch';
import { facebookLogin, googleLogin } from '@/ducks/session';

import { LoginForm } from '../LoginForm';
import { SignupForm } from '../SignupForm';

const TEST_EMAIL = 'tests@getvoiceflow.com';

require('dotenv').config({ path: './.env.test' });

jest.mock('react-ga');
jest.mock('@/client/fetch');
jest.mock('universal-cookie');
jest.mock('connected-react-router');
const mockDispatch = jest.fn();
const mockGetState = jest.fn(() => ({ router: { location: 'test location' }, session: { tabID: 'foo ' } }));

/* beforeAll(() => {
  pool.query('DELETE FROM creators WHERE email = \'tests@getvoiceflow.com\'',
    (err, result) => {
    if (err) {
      console.log(err);
    }
  });
}); */

afterEach(() => {
  jest.clearAllMocks();
});

describe('Onboarding', () => {
  const location = {
    hash: '',
    key: 'i4q8aw',
    pathname: '/login',
    search: '',
  };
  const formWrapperClass = '.auth-form-wrapper';
  it('creates accounts on signup', () => {
    const app = shallow(<SignupForm location={location} />);
    app.find(`${formWrapperClass} Input[name="name"]`).simulate('change', { target: { value: 'Voiceflow Tester' } });
    app.find(`${formWrapperClass} Input[name="email"]`).simulate('change', { target: { value: TEST_EMAIL } });
    app.find(`${formWrapperClass} Input[name="password"]`).simulate('change', { target: { value: 'password' } });
    app.find(`${formWrapperClass} Button[type="submit"]`).simulate('click');
    setTimeout(() => {
      expect(app.exists('.onboarding-survey')).toBe(true);
    }, 500);
  });
  it('disallows duplicate accounts', () => {
    const app = shallow(<SignupForm location={location} />);
    app.find(`${formWrapperClass} Input[name="name"]`).simulate('change', { target: { value: 'Voiceflow Tester' } });
    app.find(`${formWrapperClass} Input[name="email"]`).simulate('change', { target: { value: TEST_EMAIL } });
    app.find(`${formWrapperClass} Input[name="password"]`).simulate('change', { target: { value: 'password' } });
    app.find(`${formWrapperClass} Button[type="submit"]`).simulate('click');
    setTimeout(() => {
      expect(app.exists(`${formWrapperClass} .errorContainer`)).toBe(true);
    }, 500);
  });
  it('onboards on first login', () => {
    const app = shallow(<LoginForm location={location} />);
    app.find(`${formWrapperClass} Input[name="email"]`).simulate('change', { target: { value: TEST_EMAIL } });
    app.find(`${formWrapperClass} Input[name="password"]`).simulate('change', { target: { value: 'password' } });
    app.find(`${formWrapperClass} Button[type="submit"]`).simulate('click');
    setTimeout(() => {
      expect(app.exists('.onboarding-survey')).toBe(true);
      app
        .find('.onboarding-survey button')
        .first()
        .simulate('click');
      app.find('.onboarding-survey input[name="company_name"]').simulate('change', { target: { value: 'Voiceflow' } });
      app.find('.onboarding-survey input[name="role"]').simulate('change', { target: { value: 'Tester' } });
      app.find('.onboarding-survey input[name="company_size"]').simulate('change', { target: { value: 'B' } });
      app.find('.onboarding-survey input[name="industry"]').simulate('change', { target: { value: 'MEDIA' } });
      expect(app.exists('.Window')).toBe(true);
    }, 500);
  });
  it('tests the google login functionality', async () => {
    ConnectedReactRouter.getLocation.mockResolvedValue('foo');
    fetch.put.mockResolvedValue({ user: { id: 'test id' } });
    await googleLogin()(mockDispatch, mockGetState);
    expect(fetch.put.mock.calls.length).toBe(1);
    expect(mockGetState.mock.calls.length).toBe(1);
    expect(mockDispatch.mock.calls.length).toBe(3);
  });
  it('tests the facebook login functionality', async () => {
    ConnectedReactRouter.getLocation.mockResolvedValue('foo');
    fetch.put.mockResolvedValue({ user: { id: 'test id' } });
    await facebookLogin()(mockDispatch, mockGetState);
    expect(fetch.put.mock.calls.length).toBe(1);
    expect(mockGetState.mock.calls.length).toBe(1);
    expect(mockDispatch.mock.calls.length).toBe(3);
  });
});
