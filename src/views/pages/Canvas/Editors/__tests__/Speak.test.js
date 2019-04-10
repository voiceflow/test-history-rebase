import React from 'react';
import { mount, shallow, render } from 'enzyme';
import {Speak} from './../Speak';
import {defaultNode} from '../__mock__/defaultNode';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('SpeakEditor', () => {
    it('render speak block editor', () => {
        let node = defaultNode
        node.name = "Speak"
        node.extras = {
            dialogs: [{
                index: "temp",
                open: false,
                voice: "Alexa",
                rawContent: {}
            }],
            randomize: false,
            type: "speak"
        }
        const component = shallow(<Speak node={node}/>);
        expect(component.state().node).toEqual(node)
        expect(toJson(component)).toMatchSnapshot()
    });
})
