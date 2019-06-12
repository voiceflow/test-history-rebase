import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import If from '../If';
import { defaultNode } from '../__mock__/defaultNode';

describe('IfEditor', () => {
  it('render if block editor', () => {
    const node = defaultNode;
    node.name = 'If';
    node.extras = {
      expressions: [{ depth: 0, type: 'value', value: '' }],
      type: 'if',
    };
    const component = shallow(<If node={node} />);
    expect(component.state().node).toEqual(node);
    expect(toJson(component)).toMatchSnapshot();
  });
});
