import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import { ProjectTitle } from '../ProjectTitle';

describe('Project Title', () => {
  it('render project title', () => {
    const component = shallow(<ProjectTitle />).dive();
    expect(toJson(component)).toMatchSnapshot();
    component.unmount();
  });
});
