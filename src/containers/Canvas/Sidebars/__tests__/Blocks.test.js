import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import { Blocks } from '../Blocks';

describe('SideBar Blocks', () => {
  it('render sidebar blocks on admin 100', () => {
    global.user_detail = {
      admin: 100,
    };
    const component = shallow(<Blocks />);
    expect(toJson(component)).toMatchSnapshot();
    component.unmount();
  });
  it('render sidebar blocks on admin 0', () => {
    global.user_detail = {
      admin: 0,
    };
    const component = shallow(<Blocks />);
    expect(toJson(component)).toMatchSnapshot();
    component.unmount();
  });
});
