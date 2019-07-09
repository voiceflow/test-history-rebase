import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import { CanvasHeader } from '..';

describe('Canvas Header', () => {
  it('render canvas header', () => {
    const component = shallow(<CanvasHeader />);
    expect(toJson(component)).toMatchSnapshot();
    component.unmount();
  });
});
