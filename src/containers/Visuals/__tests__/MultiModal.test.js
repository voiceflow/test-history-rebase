import MultiModal from 'containers/Visuals/Multimodal';
import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import * as _ from 'lodash';
import React from 'react';

describe('MultiModal not loading', () => {
  const DISPLAYS = [
    {
      title: 'VisualTmplateTest',
      display_id: 'displayMockId',
    },
    {
      title: 'VisualTmplateTest2',
      display_id: 'displayMockId2',
    },
    {
      title: 'VisualTmplateTest3',
      display_id: 'displayMockId3',
    },
  ];

  /* eslint lodash/prefer-constant: [2, true] */
  it('renders MultiModal', () => {
    const component = shallow(
      <MultiModal.WrappedComponent
        deleteDisplay={_.noop()}
        setConfirm={_.noop()}
        loading={false}
        displays={DISPLAYS}
        history={[]}
        skill_id="mockId"
      />
    );

    expect(toJson(component)).toMatchSnapshot();
  });

  it('renders MultiModal loading', () => {
    const component = shallow(
      <MultiModal.WrappedComponent
        deleteDisplay={_.noop()}
        setConfirm={_.noop()}
        loading={true}
        displays={DISPLAYS}
        history={[]}
        skill_id="mockId2"
      />
    );

    expect(toJson(component)).toMatchSnapshot();
  });

  it('renders MultiModal no existing displays', () => {
    const component = shallow(
      <MultiModal.WrappedComponent deleteDisplay={_.noop()} setConfirm={_.noop()} loading={true} displays={[]} history={[]} skill_id="mockId3" />
    );

    expect(toJson(component)).toMatchSnapshot();
  });
});
