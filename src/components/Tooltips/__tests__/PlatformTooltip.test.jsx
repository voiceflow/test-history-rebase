import { shallow } from 'enzyme';
import React from 'react';

import PlatformTooltip from '../PlatformTooltip';

describe('Platform tooltip Test', () => {
  it('render platform tooltip', () => {
    const component = shallow(<PlatformTooltip />);
    expect(component).toMatchSnapshot();
  });
});
