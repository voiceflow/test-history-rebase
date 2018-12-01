import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow, render } from 'enzyme';
import App from '../App';

jest.mock('react-ga');

describe('App', () => {
  it('renders without crashing', () => {
    shallow(<App />);
  });
  it('redirects to login if unauthenticated', () => {
    const app = mount(<App />);
    expect(app.exists('.login-card')).toBe(true);
  });
});
