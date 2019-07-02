import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import VariableText from '../VariableText';

describe('Variable Text', () => {
  it('render variable text input', () => {
    const component = shallow(<VariableText />);

    expect(toJson(component).children[1]).toMatchSnapshot();
  });
});
