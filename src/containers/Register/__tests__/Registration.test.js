import axios from 'axios';
import { fbLogin, googleLogin } from 'ducks/account';
import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import { LoginForm } from '../LoginForm';
import { SignupForm } from '../SignupForm';
import Account from '..';

const TEST_EMAIL = 'tests@getvoiceflow.com';

require('dotenv').config({ path: './.env.test' });

jest.mock('react-ga');
jest.mock('axios');
jest.mock('universal-cookie');
const mockDispatch = jest.fn();
const mockGetState = jest.fn(() => ({ router: { location: 'test location' } }));

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
  it('renders without crashing', () => {
    const component = shallow(<Account location={location} />);
    expect(toJson(component)).toMatchSnapshot();
  });
  it('redirects to signup if unauthenticated', () => {
    const app = shallow(<Account location={location} />);
    expect(app.exists('.open-register')).toBe(true);
  });
  it('creates accounts on signup', () => {
    const app = shallow(<SignupForm location={location} />);
    app.find('#signup-form Input[name="name"]').simulate('change', { target: { value: 'Voiceflow Tester' } });
    app.find('#signup-form Input[name="email"]').simulate('change', { target: { value: TEST_EMAIL } });
    app.find('#signup-form Input[name="password"]').simulate('change', { target: { value: 'password' } });
    app.find('#signup-form Button[type="submit"]').simulate('click');
    setTimeout(() => {
      expect(app.exists('.onboarding-survey')).toBe(true);
    }, 500);
  });
  it('disallows duplicate accounts', () => {
    const app = shallow(<SignupForm location={location} />);
    app.find('#signup-form Input[name="name"]').simulate('change', { target: { value: 'Voiceflow Tester' } });
    app.find('#signup-form Input[name="email"]').simulate('change', { target: { value: TEST_EMAIL } });
    app.find('#signup-form Input[name="password"]').simulate('change', { target: { value: 'password' } });
    app.find('#signup-form Button[type="submit"]').simulate('click');
    setTimeout(() => {
      expect(app.exists('#signup-form .alert-danger')).toBe(true);
    }, 500);
  });
  it('onboards on first login', () => {
    const app = shallow(<LoginForm location={location} />);
    app.find('#login-form Input[name="email"]').simulate('change', { target: { value: TEST_EMAIL } });
    app.find('#login-form Input[name="password"]').simulate('change', { target: { value: 'password' } });
    app.find('#login-form Button[type="submit"]').simulate('click');
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
    axios.put.mockResolvedValue({ data: { user: { id: 'test id' } } });
    await googleLogin()(mockDispatch, mockGetState);
    expect(axios.put.mock.calls.length).toBe(1);
    expect(mockGetState.mock.calls.length).toBe(1);
    expect(mockDispatch.mock.calls.length).toBe(2);
  });
  it('tests the facebook login functionality', async () => {
    axios.put.mockResolvedValue({ data: { user: { id: 'test id' } } });
    await fbLogin()(mockDispatch, mockGetState);
    expect(axios.put.mock.calls.length).toBe(1);
    expect(mockGetState.mock.calls.length).toBe(1);
    expect(mockDispatch.mock.calls.length).toBe(2);
  });
});
