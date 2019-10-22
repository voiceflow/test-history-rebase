import { shallow } from 'enzyme';
import React from 'react';

import MultipleFields from '../MultipleFields';

describe('Multiple Field Test', () => {
  it('multiple fields', () => {
    const component = shallow(<MultipleFields />);
    expect(component).toMatchSnapshot();
  });
});
