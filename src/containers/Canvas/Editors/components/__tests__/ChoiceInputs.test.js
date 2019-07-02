import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import ChoiceInputs from '../ChoiceInputs';

describe('Choice Inputs', () => {
  it('render choice input', () => {
    const component = shallow(<ChoiceInputs choices={[{ value: 'a' }, { value: 'b' }]} inputs={[{ value: 'a' }, { value: 'b' }]} />);

    expect(toJson(component)).toMatchSnapshot();
  });
});
