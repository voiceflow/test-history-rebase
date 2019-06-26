import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import { FlowBar } from '../FlowBar';

describe('FlowBar', () => {
  it('render flow bar', () => {
    const component = shallow(<FlowBar />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
