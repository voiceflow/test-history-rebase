import { shallow } from 'enzyme';
import React from 'react';

import SkillDetail from '../../components/SkillDetail/SkillDetail';
import TeamSummary from '../../components/TeamSummary/TeamSummary';
import { testBoard } from './testAdminState';

let wrapped;

beforeEach(() => {
  wrapped = shallow(<TeamSummary board={testBoard} />);
});

describe('Team Summary', () => {
  it('renders all two skills for the test board', () => {
    expect(wrapped.find(SkillDetail).length).toEqual(2);
  });
});
