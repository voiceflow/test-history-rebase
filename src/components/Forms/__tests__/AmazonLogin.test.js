import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import AmazonLogin from '../AmazonLogin';

describe('Amazon Login Test', () => {
  it('render empty card', () => {
    const component = shallow(<AmazonLogin />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
