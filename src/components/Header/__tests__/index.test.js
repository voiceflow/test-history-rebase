import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import Header from '..';

describe('Header', () => {
  it('render header', () => {
    const component = shallow(<Header />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
