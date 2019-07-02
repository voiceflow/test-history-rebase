import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import ChoiceInput from '../ChoiceInput';

describe('Choice Input', () => {
  it('render choice input', () => {
    const component = shallow(<ChoiceInput input="some value " choice={{}} />);

    expect(toJson(component)).toMatchSnapshot();
  });
});
