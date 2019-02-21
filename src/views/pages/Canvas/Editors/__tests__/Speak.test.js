import React from 'react';
import { mount, shallow, render } from 'enzyme';
import Speak from './../Speak';
import {defaultNode} from '../__mock__/defaultNode';

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
        expect(component).toMatchSnapshot()
    });
    it('add and remove speech', () => {
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
        const addSpeech = jest.spyOn(Speak.prototype, "handleAddBlock");
        const removeSpeech = jest.spyOn(Speak.prototype, "handleRemoveBlock");
        const component = shallow(<Speak node={node} onUpdate={() => {}}/>)
        component.find('button.btn-clear').first().simulate('click')
        expect(addSpeech).toBeCalled()
        component.find('button.close').first().simulate('click')
        expect(removeSpeech).toBeCalled()
    });
})
