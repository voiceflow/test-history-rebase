import { shallow } from 'enzyme';
import React from 'react';

import SkillDetail from '../../components/SkillDetail/SkillDetail';
import { testSkill } from './testAdminState';

// eslint-disable-next-line no-unused-vars
let wrapped;

beforeEach(() => {
  wrapped = shallow(<SkillDetail skill={testSkill} />);
});

describe('Skill Detail', () => {
  // eslint-disable-next-line lodash/prefer-noop
  it('renders all the necessary information', () => {
    // console.log('text: ', wrapped.text());
    // expect(wrapped.text()).toContain(testSkill.skill_id);
  });
});
