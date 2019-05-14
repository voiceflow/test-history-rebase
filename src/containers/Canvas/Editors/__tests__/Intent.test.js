import React from 'react';
import { mount, shallow, render } from 'enzyme/build';
import { Intent } from '../Intent';
import {defaultNode} from '../__mock__/defaultNode';
import {intents} from '../__mock__/Intents';
import {built_ins} from '../__mock__/BuiltIns';
import {diagrams} from '../__mock__/Diagrams';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('IntentEditor', () => {
    it('render intent block editor', () => {
        let diagram_id = "test_id"
        let node = defaultNode
        let platform = 'alexa'
        node.name = "Intent"
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
            type: "intent"
        }

        const component = shallow(<Intent diagrams={diagrams} diagram_id={diagram_id} node={node} intents={intents} platform={platform} built_ins={built_ins} diagrams={diagrams} />);
        expect(component.state().node).toEqual(node)
        expect(toJson(component)).toMatchSnapshot()
    });
})
