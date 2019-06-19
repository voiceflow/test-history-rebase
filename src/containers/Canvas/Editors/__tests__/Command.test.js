import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import { Command } from '../Command';
import { built_ins } from '../__mock__/BuiltIns';
import { diagrams } from '../__mock__/Diagrams';
import { intents } from '../__mock__/Intents';
import { defaultNode } from '../__mock__/defaultNode';

describe('CommandEditor', () => {
  it('render command block editor', () => {
    const node = defaultNode;
    node.name = 'Command';
    node.extras = {
      alexa: {
        intent: null,
        mapping: [],
        resume: true,
      },
      google: {
        intent: null,
        mapping: [],
        resume: true,
      },
      type: 'command',
    };
    const platform = 'alexa';
    const diagram_id = 'test_id';
    const component = shallow(
      <Command node={node} intents={intents} platform={platform} built_ins={built_ins} diagrams={diagrams} diagram_id={diagram_id} />
    );
    expect(component.state().node).toEqual(node);
    expect(toJson(component)).toMatchSnapshot();
  });
});
