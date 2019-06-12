import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import { testSkill } from '../../__mock__/MockSkill';
import { Mail } from '../Mail';
import { defaultNode } from '../__mock__/defaultNode';

describe('MailEditor', () => {
  it('render mail block editor', () => {
    const node = defaultNode;
    node.name = 'Mail';
    node.extras = {
      mapping: [],
      template_id: null,
      to: '',
      type: 'mail',
    };
    const skill = testSkill;
    const templates = [];
    const component = shallow(<Mail node={node} templates={templates} skill={skill} />);
    expect(component.state().node).toEqual(node);
    expect(toJson(component)).toMatchSnapshot();
  });
});
