require('dotenv').config()
import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow, render } from 'enzyme';
import { pool } from '../../../services';
import App from '../App';

jest.mock('react-ga');

/*beforeAll(() => {
  pool.query('DELETE FROM creators WHERE email = \'tests@getvoiceflow.com\'',
    (err, result) => {
    if (err) {
      console.log(err);
    }
  });
});*/

describe('Onboarding', () => {
  it('renders without crashing', () => {
    mount(<App />);
  });
  it('redirects to login if unauthenticated', () => {
    const app = mount(<App />);
    expect(app.exists('#signup-form')).toBe(true);
  });
  it('creates accounts on signup', () => {
    const app = mount(<App />);
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
    const app = mount(<App />);
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
    const app = mount(<App />);
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
});
