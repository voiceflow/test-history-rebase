import HomeIcon from 'components/svgs/home.svg';
import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import SvgIcon from '../SvgIcon';

describe('SvgIcon', () => {
  it('renders SvgIcon', () => {
    const component = shallow(<SvgIcon icon={HomeIcon} />);

    expect(toJson(component)).toMatchSnapshot();
  });
});
