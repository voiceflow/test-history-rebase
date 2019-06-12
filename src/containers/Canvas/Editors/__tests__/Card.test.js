import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import Card from '../Card';
import { defaultNode } from '../__mock__/defaultNode';

describe('Card', () => {
  it('render card block editor', () => {
    const node = defaultNode;
    node.name = 'Card';
    node.extras = {
      cardtype: 'Simple',
      content: {},
      title: {},
      type: 'card',
    };
    const component = shallow(<Card node={node} />);
    expect(component.state().node).toEqual(node);
    expect(toJson(component)).toMatchSnapshot();
  });
});
