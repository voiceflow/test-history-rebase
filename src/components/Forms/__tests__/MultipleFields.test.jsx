import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import MultipleFields from '../MultipleFields';

describe('Multiple Field Test', () => {
  it('multiple fields', () => {
    const component = shallow(<MultipleFields />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
