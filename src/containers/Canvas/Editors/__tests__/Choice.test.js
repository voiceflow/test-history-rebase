import React from 'react';
import { mount, shallow, render } from 'enzyme/build';
import _ from 'lodash'
import { Choice } from '../Choice';
import {defaultNode} from '../__mock__/defaultNode';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('Choice', () => {
    it('render choice block editor', () => {
        let node = defaultNode
        node.name = "Choice"
        node.extras = {
            audio: "",
            audioText: "",
            audioVoice: "",
            choices: [],
            inputs: [],
            prompt: "",
            promptText: "",
            promptVoice: "",
            type: "choice"
        }
        const component = shallow(<Choice node={node}/>);
        expect(component.state().node).toEqual(node)
        expect(toJson(component)).toMatchSnapshot()
    });
})
