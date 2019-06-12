import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import _ from 'lodash';
import React from 'react';

import Menu from '../Menu';

describe('Menu', () => {
  it('render menu', () => {
    const component = shallow(<Menu build={_.noop} />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
