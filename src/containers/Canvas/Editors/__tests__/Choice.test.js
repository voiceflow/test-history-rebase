import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import { Choice } from '../Choice';
import { defaultNode } from '../__mock__/defaultNode';

describe('Choice', () => {
  it('render choice block editor', () => {
    const node = defaultNode;
    node.name = 'Choice';
    node.extras = {
      audio: '',
      audioText: '',
      audioVoice: '',
      choices: [],
      inputs: [],
      prompt: '',
      promptText: '',
      promptVoice: '',
      type: 'choice',
    };
    const component = shallow(<Choice node={node} />);
    expect(component.state().node).toEqual(node);
    expect(toJson(component)).toMatchSnapshot();
  });
});
