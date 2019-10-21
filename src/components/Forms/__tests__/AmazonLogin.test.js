import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import { AmazonLoginButton } from '../AmazonLogin';

describe('Amazon Login Test', () => {
  it('render empty card', () => {
    const component = shallow(<AmazonLoginButton />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
