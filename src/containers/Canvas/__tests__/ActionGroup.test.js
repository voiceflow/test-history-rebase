import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import { testSkill } from '../__mock__/MockSkill';
import { ActionGroup } from '../components/ActionGroup/ActionGroup';

const account = {
  id: 1,
  image: '26A69A|EBF7F5',
  name: 'John Doe',
  email: 'jdoe@gmail.com',
};

describe('ActionGroup', () => {
  it('render action group/top nav bar', () => {
    const skill = testSkill;
    const component = shallow(<ActionGroup skill={skill} user={account} platform="alexa" />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
