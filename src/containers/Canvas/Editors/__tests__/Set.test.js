import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import Set from '../Set';
import { defaultNode } from '../__mock__/defaultNode';

describe('SetEditor', () => {
  it('render set block editor', () => {
    const node = defaultNode;
    node.name = 'Set';
    node.extras = {
      sets: [{ expressions: {}, variable: null }],
      type: 'set',
    };
    const component = shallow(<Set node={node} />);
    expect(component.state().node).toEqual(node);
    expect(toJson(component)).toMatchSnapshot();
  });
});
