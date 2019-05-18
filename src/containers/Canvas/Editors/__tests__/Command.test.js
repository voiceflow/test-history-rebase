import React from 'react';
import { mount, shallow, render } from 'enzyme/build';
import { Command } from '../Command';
import {defaultNode} from '../__mock__/defaultNode';
import {intents} from '../__mock__/Intents';
import {built_ins} from '../__mock__/BuiltIns';
import {diagrams} from '../__mock__/Diagrams';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('CommandEditor', () => {
    it('render command block editor', () => {
        let node = defaultNode
        node.name = "Command"
        node.extras = {
            alexa: {
                intent: null,
                mapping: [],
                resume: true
            },
            google: {
                intent: null,
                mapping: [],
                resume: true
            },
            type: "command"
        }
        let platform = 'alexa'
        let diagram_id = "test_id"
        const component = shallow(<Command node={node} intents={intents} platform={platform} built_ins={built_ins} diagrams={diagrams} diagram_id={diagram_id} />);
        expect(component.state().node).toEqual(node)
        expect(toJson(component)).toMatchSnapshot()
    });
})
