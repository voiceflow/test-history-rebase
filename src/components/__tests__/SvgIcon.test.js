import { shallow } from 'enzyme/build';
import React from 'react';
import HomeIcon from 'svgs/home.svg';

import HomeIcon from '@/svgs/home.svg';

import SvgIcon from '../SvgIcon';

describe('SvgIcon', () => {
  it('renders SvgIcon', () => {
    const component = shallow(<SvgIcon icon={HomeIcon} />);

    expect(component).toMatchSnapshot();
  });
});
