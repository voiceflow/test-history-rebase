import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import Story from '../Story';

describe('StoryEditor', () => {
  it('render story block editor', () => {
    const component = shallow(<Story />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
