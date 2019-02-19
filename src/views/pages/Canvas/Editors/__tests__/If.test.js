import React from 'react';
import { mount, shallow, render } from 'enzyme';
import If from './../If';
import {defaultNode} from '../__mock__/defaultNode';

const clickFn = jest.fn()

describe('IfEditor', () => {
    it('render if block editor', () => {
        let node = defaultNode
        node.name = "If"
        node.extras = {
            expressions: [{depth: 0, type: "value", value: ""}],
            type: "if"
        }
        const component = shallow(<If node={node}/>);
        expect(component.state().node).toEqual(node)
        expect(component).toMatchSnapshot()
    });
})
