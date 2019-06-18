import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import { Speak } from '../Speak';
import { defaultNode } from '../__mock__/defaultNode';

describe('SpeakEditor', () => {
  it('render speak block editor', () => {
    const node = defaultNode;
    node.name = 'Speak';
    node.extras = {
      dialogs: [
        {
          index: 'temp',
          open: false,
          voice: 'Alexa',
          rawContent: {},
        },
      ],
      randomize: false,
      type: 'speak',
    };
    const component = shallow(<Speak node={node} />);
    expect(component.state().node).toEqual(node);
    expect(toJson(component)).toMatchSnapshot();
  });
});
