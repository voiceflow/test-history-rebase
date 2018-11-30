import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import App from '../App';

jest.mock('react-ga');

describe('App', () => {
  it('renders without crashing', () => {
    shallow(<App />);
  });
});
