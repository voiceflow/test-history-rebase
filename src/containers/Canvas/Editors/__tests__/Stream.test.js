import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import Stream from '../Stream';
import { defaultNode } from '../__mock__/defaultNode';

describe('StreamEditor', () => {
  it('render stream block editor', () => {
    const node = defaultNode;
    node.name = 'Stream';
    node.extras = {
      type: 'stream',
      audio: '',
    };
    const component = shallow(<Stream node={node} />);
    expect(component.state().node).toEqual(node);
    expect(toJson(component)).toMatchSnapshot();
  });
});
