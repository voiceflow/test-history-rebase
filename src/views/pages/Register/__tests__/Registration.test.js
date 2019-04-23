require('dotenv').config({path:'./.env.test'})
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { mountWrap, shallowWrap } from '../TestHelper/ContextWrapper';
import { mount, shallow, render } from 'enzyme';
import { Account } from '../index';
import toJson from 'enzyme-to-json';
import axios from 'axios'
import { googleLogin, fbLogin } from 'ducks/account'

jest.mock('react-ga');
jest.mock('axios')
jest.mock('universal-cookie')
const mockDispatch = jest.fn()
const mockGetState = jest.fn(() => ({ router: { location: "test location" }}))

/*beforeAll(() => {
  pool.query('DELETE FROM creators WHERE email = \'tests@getvoiceflow.com\'',
    (err, result) => {
    if (err) {
      console.log(err);
    }
  });
});*/

afterEach(() => {
  jest.clearAllMocks()
})

describe('Onboarding', () => {
  let location = {
      hash: "",
      key: "i4q8aw",
      pathname: "/login",
      search: "",
  }
  it('renders without crashing', () => {
    const component = shallow(<Account location={location} />);
    expect(toJson(component)).toMatchSnapshot()
  });
  it('redirects to login if unauthenticated', () => {
    const app = shallow(<Account location={location} />);
    expect(app.exists('#signup-form')).toBe(true);
  });
  it('creates accounts on signup', () => {
    const app = mountWrap(<Router><Account location={location} /></Router>);
    app.find('#signup-form input[name="r_name"]')
      .simulate('change', {target: {value:'Voiceflow Tester'}});
    app.find('#signup-form input[name="r_email"]')
      .simulate('change', {target: {value:'tests@getvoiceflow.com'}});
    app.find('#signup-form input[name="r_password"]')
      .simulate('change', {target: {value:'password'}});
    app.find('#signup-form button[type="submit"]')
      .simulate('click');
    setTimeout(() => {
      expect(app.exists('.onboarding-survey')).toBe(true);
    }, 500);
  });
  it('disallows duplicate accounts', () => {
    const app = mountWrap(<Router><Account location={location} /></Router>);
    app.find('#signup-form input[name="r_name"]')
      .simulate('change', {target: {value:'Voiceflow Tester'}});
    app.find('#signup-form input[name="r_email"]')
      .simulate('change', {target: {value:'tests@getvoiceflow.com'}});
    app.find('#signup-form input[name="r_password"]')
      .simulate('change', {target: {value:'password'}});
    app.find('#signup-form button[type="submit"]')
      .simulate('click');
    setTimeout(() => {
      expect(app.exists('#signup-form .alert-danger')).toBe(true);
    }, 500);
  });
  it('onboards on first login', () => {
    const app = mountWrap(<Router><Account location={location} /></Router>);
    app.find('#login-form input[name="email"]')
      .simulate('change', {target: {value:'tests@getvoiceflow.com'}});
    app.find('#login-form input[name="password"]')
      .simulate('change', {target: {value:'password'}});
    app.find('#login-form button[type="submit"]')
      .simulate('click');
    setTimeout(() => {
      expect(app.exists('.onboarding-survey')).toBe(true);
      app.find('.onboarding-survey button').first()
        .simulate('click');
      app.find('.onboarding-survey input[name="company_name"]')
        .simulate('change', {target: {value:'Voiceflow'}});
      app.find('.onboarding-survey input[name="role"]')
        .simulate('change', {target: {value:'Tester'}});
      app.find('.onboarding-survey input[name="company_size"]')
        .simulate('change', {target: {value:'B'}});
      app.find('.onboarding-survey input[name="industry"]')
        .simulate('change', {target: {value:'MEDIA'}});
      expect(app.exists('.Window')).toBe(true);
    }, 500);
  });
  it('tests the google login functionality', async () => {
    axios.put.mockResolvedValue({data: { user: { id: "test id"}}})
    await googleLogin()(mockDispatch, mockGetState)
    expect(axios.put.mock.calls.length).toBe(1)
    expect(mockGetState.mock.calls.length).toBe(1)
    expect(mockDispatch.mock.calls.length).toBe(2)
  })
  it('tests the facebook login functionality', async () => {
    axios.put.mockResolvedValue({data: { user: { id: "test id"}}})
    await fbLogin()(mockDispatch, mockGetState)
    expect(axios.put.mock.calls.length).toBe(1)
    expect(mockGetState.mock.calls.length).toBe(1)
    expect(mockDispatch.mock.calls.length).toBe(2)
  })
});