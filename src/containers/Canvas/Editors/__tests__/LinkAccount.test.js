import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import { testSkill } from '../../__mock__/MockSkill';
import LinkAccount from '../LinkAccount';

describe('AccountLinkEditor', () => {
  it('render account linking block editor', () => {
    const skill = testSkill;
    const component = shallow(<LinkAccount skill={skill} />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
