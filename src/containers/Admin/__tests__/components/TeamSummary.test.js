import React from 'react';
import {shallow} from 'enzyme';

import TeamSummary from '../../components/TeamSummary/TeamSummary';

import {testBoard} from './testAdminState';
import SkillDetail from "../../components/SkillDetail/SkillDetail";

let wrapped;

beforeEach(() => {
  wrapped = shallow(<TeamSummary board={testBoard}/>)
});

it('renders all two skills for the test board', () => {
  expect(wrapped.find(SkillDetail).length).toEqual(2);
});
