import { shallow } from 'enzyme/build';
import React from 'react';

import SvgIcon from '../SvgIcon';

describe('SvgIcon', () => {
  it('renders SvgIcon', () => {
    const component = shallow(<SvgIcon icon="home" />);

    expect(component).toMatchSnapshot();
  });
});
