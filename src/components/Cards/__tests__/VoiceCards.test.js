import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import VoiceCards from '../VoiceCards';

describe('Voice Card Test', () => {
  it('render empty card', () => {
    const component = shallow(<VoiceCards />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
