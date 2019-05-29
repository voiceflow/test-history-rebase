import React from 'react';
import {mount} from 'enzyme';

import initialState from './testAdminState';
import InternalLookup from '../../components/InternalLookup/InternalLookup';
import TeamSummary from '../../components/TeamSummary/TeamSummary';
import Root, {history} from 'store/store';
import {ConnectedRouter} from "connected-react-router";
import SkillDetail from "../../components/SkillDetail/SkillDetail";

let wrapped;

beforeEach(() => {

  wrapped = mount(
    <Root initialState={initialState}>
      <ConnectedRouter history={history}>
        <InternalLookup/>
      </ConnectedRouter>
    </Root>
  );

});

describe('boards display', () => {

  it('Renders a team summary for each board', () => {
    expect(wrapped.find(TeamSummary).length).toEqual(2);
  });

  it('Renders a skill detail for each skill', () => {
    expect(wrapped.find(SkillDetail).length).toEqual(3);
  })

});

describe('filter boards', () => {

  it('filters the boards to match one search term', () => {
    wrapped.find('Input#skill_filter_input').simulate('change', {
      target: {value: 'skill2', name: 'skill_filter'}
    });
    wrapped.update();
    expect(wrapped.find(TeamSummary).length).toEqual(1);
    expect(wrapped.find(SkillDetail).length).toEqual(1);
  });

  it('also filters the boards to match a general search term', () => {
    wrapped.find('Input#skill_filter_input').simulate('change', {
      target: {value: 'skill1', name: 'skill_filter'}
    });
    wrapped.update();
    expect(wrapped.find(TeamSummary).length).toEqual(2);
    expect(wrapped.find(SkillDetail).length).toEqual(2);
  })

});
