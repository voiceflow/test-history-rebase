import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow, render } from 'enzyme';
import Canvas from '../views/pages/Canvas/index.js';

describe('Canvas', () => {
  it('renders without crashing', () => {
    mount(<Canvas />);
  });
});
