import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import SetExpression from '../SetExpression';

describe('Set Expression', () => {
  it('render expression', () => {
    const component = shallow(<SetExpression />);

    expect(toJson(component)).toMatchSnapshot();
  });
});
