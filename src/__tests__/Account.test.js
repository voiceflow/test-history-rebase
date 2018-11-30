import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow, render } from 'enzyme';
import Account from '../views/pages/Account/index.js';

describe('Account', () => {
  it('renders without crashing', () => {
    shallow(<Account />);
  });
});
