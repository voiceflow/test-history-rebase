import React from 'react';
import { mount, shallow, render } from 'enzyme';
import Set from './../Set';
import {defaultNode} from '../__mock__/defaultNode';

const clickFn = jest.fn()

describe('SetEditor', () => {
    it('render set block editor', () => {
        let node = defaultNode;
        node.name = "Set"
        node.extras = {
            sets: [{expressions: {}, variable: null}],
            type: "set"
        }
        const component = shallow(<Set node={node}/>);
        expect(component.state().node).toEqual(node)
        expect(component).toMatchSnapshot()
    });
})
