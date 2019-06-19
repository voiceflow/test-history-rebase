import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import { Intent } from '../Intent';
import { built_ins } from '../__mock__/BuiltIns';
import { diagrams } from '../__mock__/Diagrams';
import { intents } from '../__mock__/Intents';
import { defaultNode } from '../__mock__/defaultNode';

describe('IntentEditor', () => {
  it('render intent block editor', () => {
    const diagram_id = 'test_id';
    const node = defaultNode;
    const platform = 'alexa';
    node.name = 'Intent';
    node.extras = {
      alex: {
        intent: null,
        mappings: [],
        resume: false,
      },
      google: {
        intent: null,
        mappings: [],
        resume: false,
      },
      type: 'intent',
    };

    const component = shallow(
      <Intent diagram_id={diagram_id} node={node} intents={intents} platform={platform} built_ins={built_ins} diagrams={diagrams} />
    );
    expect(component.state().node).toEqual(node);
    expect(toJson(component)).toMatchSnapshot();
  });
});
