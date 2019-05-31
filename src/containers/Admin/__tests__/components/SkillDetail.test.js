import React from 'react';
import {shallow} from 'enzyme';

import {testSkill} from './testAdminState';
import SkillDetail from "../../components/SkillDetail/SkillDetail";

let wrapped;

beforeEach(() => {
  wrapped = shallow(<SkillDetail skill={testSkill}/>)
});

it('renders all the necessary information', () => {
  // console.log('text: ', wrapped.text());
  // expect(wrapped.text()).toContain(testSkill.skill_id);
});
