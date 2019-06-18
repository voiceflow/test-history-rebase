import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import { testSkill } from '../../__mock__/MockSkill';
import { Display } from '../Display';
import { defaultNode } from '../__mock__/defaultNode';

describe('DisplayEditor', () => {
  it('render display block editor', () => {
    const node = defaultNode;
    node.name = 'Display';
    node.extras = {
      datasource: '',
      display_id: null,
      type: 'display',
      update_on_change: false,
    };
    const display = [];
    const component = shallow(<Display node={node} displays={display} skill={testSkill} />);
    expect(component.state().node).toEqual(node);
    expect(toJson(component)).toMatchSnapshot();
  });
});
