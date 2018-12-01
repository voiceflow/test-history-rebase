import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow, render } from 'enzyme';
import App from '../App';

jest.mock('react-ga');


describe('App', () => {
  it('renders without crashing', () => {
    mount(<App />);
  });
  it('redirects to login if unauthenticated', () => {
    const app = mount(<App />);
    expect(app.exists('#signup-form')).toBe(true);
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
});
