import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import CancelPayment from '../CancelPayment';

describe('CancelPayment', () => {
  it('render cancel payment editor', () => {
    const component = shallow(<CancelPayment />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
