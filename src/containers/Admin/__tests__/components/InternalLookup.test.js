import { ConnectedRouter } from 'connected-react-router';
import { mount } from 'enzyme';
import React from 'react';
import Root, { history } from 'store/store';

import InternalLookup from '../../components/InternalLookup/InternalLookup';
import SkillDetail from '../../components/SkillDetail/SkillDetail';
import TeamSummary from '../../components/TeamSummary/TeamSummary';
import { initialState } from './testAdminState';

let wrapped;

beforeEach(() => {
  wrapped = mount(
    <Root initialState={initialState}>
      <ConnectedRouter history={history}>
        <InternalLookup />
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
  });
});

describe('filter boards', () => {
  const filterSelector = 'Input#skill_filter_input';

  it('filters the boards to match one search term', () => {
    wrapped.find(filterSelector).simulate('change', {
      target: { value: 'skill2', name: 'skill_filter' },
    });
    wrapped.update();
    expect(wrapped.find(TeamSummary).length).toEqual(1);
    expect(wrapped.find(SkillDetail).length).toEqual(1);
  });

  it('also filters the boards to match a general search term', () => {
    wrapped.find(filterSelector).simulate('change', {
      target: { value: 'skill1', name: 'skill_filter' },
    });
    wrapped.update();
    expect(wrapped.find(TeamSummary).length).toEqual(2);
    expect(wrapped.find(SkillDetail).length).toEqual(2);
  });

  it('can also clear the filter and view all skills', () => {
    wrapped.find(filterSelector).simulate('change', {
      target: { value: '', name: 'skill_filter' },
    });
    wrapped.update();
    expect(wrapped.find(TeamSummary).length).toEqual(2);
    expect(wrapped.find(SkillDetail).length).toEqual(3);
  });
});
