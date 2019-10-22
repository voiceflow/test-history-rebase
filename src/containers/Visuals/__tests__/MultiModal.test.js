import { shallow } from 'enzyme/build';
import * as _ from 'lodash';
import React from 'react';

import MultiModal from '../Multimodal';

describe('MultiModal not loading', () => {
  const DISPLAYS = [
    {
      name: 'VisualTmplateTest',
      id: 'displayMockId',
    },
    {
      name: 'VisualTmplateTest2',
      id: 'displayMockId2',
    },
    {
      name: 'VisualTmplateTest3',
      id: 'displayMockId3',
    },
  ];

  it('renders MultiModal', () => {
    const component = shallow(
      <MultiModal.WrappedComponent
        deleteDisplay={_.noop()}
        setConfirm={_.noop()}
        loading={false}
        displays={DISPLAYS}
        history={{}}
        skill_id="mockId"
      />
    );

    expect(component).toMatchSnapshot();
  });

  it('renders MultiModal loading', () => {
    const component = shallow(
      <MultiModal.WrappedComponent
        deleteDisplay={_.noop()}
        setConfirm={_.noop()}
        loading={true}
        displays={DISPLAYS}
        history={{}}
        skill_id="mockId2"
      />
    );

    expect(component).toMatchSnapshot();
  });

  it('renders MultiModal no existing displays', () => {
    const component = shallow(
      <MultiModal.WrappedComponent deleteDisplay={_.noop()} setConfirm={_.noop()} loading={true} displays={[]} history={{}} skill_id="mockId3" />
    );

    expect(component).toMatchSnapshot();
  });
});
