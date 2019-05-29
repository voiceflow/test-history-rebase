import React from 'react';
import {mount} from 'enzyme';

import {Input} from 'reactstrap';
import initialState from './testAdminState';
import InternalLookup from '../../components/InternalLookup/InternalLookup';
import TeamSummary from '../../components/TeamSummary/TeamSummary';
import Root from 'store/store';

let wrapped;

beforeEach(() => {

  wrapped = mount(
    <Root initialState={initialState}>
      <InternalLookup/>
    </Root>
  );

});

describe('filter boards', () => {

  beforeEach(() => {
    console.log('wrapped: ', wrapped);
    wrapped.find('#skill_filter_input').simulate('change', {
      target: {value: 'skill2'}
    });
    wrapped.update();
  });

  it('filters the boards to match a search term', () => {
    expect(wrapped.find(TeamSummary).length).toEqual(2);
  })

});

// describe('boards display', () => {
//
//   it('Renders a team summary for each board', () => {
//     expect(wrapped.find(TeamSummary).length).toEqual(2);
//   });
//
// });
