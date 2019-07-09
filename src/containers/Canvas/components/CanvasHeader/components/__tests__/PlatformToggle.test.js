import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import PlatformToggle from '../PlatformToggle';

describe('Platform Toggle', () => {
  it('render platform toggle', () => {
    const component = shallow(<PlatformToggle />);
    expect(toJson(component)).toMatchSnapshot();
    component.unmount();
  });
});
