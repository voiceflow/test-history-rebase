import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import Random from '../Random';
import { defaultNode } from '../__mock__/defaultNode';

describe('RandomEditor', () => {
  it('render random block editor', () => {
    const node = defaultNode;
    node.name = 'Random';
    node.extras = {
      paths: 1,
      type: 'random',
    };
    const component = shallow(<Random node={node} />);
    expect(component.state().node).toEqual(node);
    expect(toJson(component)).toMatchSnapshot();
  });
});
