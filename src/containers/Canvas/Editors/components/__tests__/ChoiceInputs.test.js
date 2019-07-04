import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import ChoiceInputs from '../ChoiceInputs';

describe('Choice Inputs', () => {
  it('render choice input', () => {
    const component = shallow(<ChoiceInputs choices={[{ value: 'a', key: 1 }, { value: 'b', key: 2 }]} inputs={[{ value: 'a' }, { value: 'b' }]} />);

    expect(toJson(component)).toMatchSnapshot();
  });
});
