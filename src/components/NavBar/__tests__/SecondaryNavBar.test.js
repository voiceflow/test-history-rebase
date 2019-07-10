import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import { SecondaryNavBar } from '../SecondaryNavBar';

describe('Secondary Nav Bar', () => {
  it('render secondary nav bar', () => {
    const component = shallow(<SecondaryNavBar />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
