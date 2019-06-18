import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import { Interaction } from '../Interaction';
import { defaultNode } from '../__mock__/defaultNode';

describe('InteractionEditor', () => {
  it('render alexa interaction block editor', () => {
    const node = defaultNode;
    node.name = 'Interaction';
    node.extras = {
      alexa: { choices: [] },
      google: { choices: [] },
      type: 'interaction',
    };
    const platform = 'alexa';
    const component = shallow(<Interaction node={node} platform={platform} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('render google interaction block editor', () => {
    const node = defaultNode;
    node.name = 'Interaction';
    node.extras = {
      alexa: { choices: [] },
      google: { choices: [] },
      type: 'interaction',
    };
    const platform = 'google';
    const component = shallow(<Interaction node={node} platform={platform} />);
    expect(component.state().node).toEqual(node);
  });
});
