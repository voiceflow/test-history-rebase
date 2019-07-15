import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import { WidgetBar } from '../WidgetBar';

describe('Widget Bar', () => {
  it('render canvas widget bar', () => {
    const component = shallow(<WidgetBar.WrappedComponent />);
    expect(toJson(component)).toMatchSnapshot();
    component.unmount();
  });
});
