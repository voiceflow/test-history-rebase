import React from 'react';
import { mount, shallow, render } from 'enzyme';
import Interaction from './../Interaction';
import {defaultNode} from '../__mock__/defaultNode';

const clickFn = jest.fn()

describe('InteractionEditor', () => {
    it('render alexa interaction block editor', () => {
        let node = defaultNode
        node.name = "Interaction"
        node.extras = {
            alexa: {choices: []},
            google: {choices: []},
            type: "interaction"
        }
        let platform = 'alexa'
        const component = shallow(<Interaction node={node} platform={platform}/>);
        expect(component).toMatchSnapshot()
    });
})

describe('InteractionEditor', () => {
    it('render google interaction block editor', () => {
        let node = defaultNode
        node.name = "Interaction"
        node.extras = {
            alexa: {choices: []},
            google: {choices: []},
            type: "interaction"
        }
        let platform = 'google'
        const component = shallow(<Interaction node={node} platform={platform}/>);
        expect(component.state().node).toEqual(node)
        expect(component).toMatchSnapshot()
    });
})
