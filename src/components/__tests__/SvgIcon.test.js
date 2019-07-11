import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';
import HomeIcon from 'svgs/home.svg';

import SvgIcon from '../SvgIcon';

describe('SvgIcon', () => {
  it('renders SvgIcon', () => {
    const component = shallow(<SvgIcon icon={HomeIcon} />);

    expect(toJson(component)).toMatchSnapshot();
  });
});
