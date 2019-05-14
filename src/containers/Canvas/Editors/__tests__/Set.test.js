import React from 'react';
import { mount, shallow, render } from 'enzyme/build';
import Set from '../Set';
import {defaultNode} from '../__mock__/defaultNode';
import toJson from 'enzyme-to-json';

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
        expect(toJson(component)).toMatchSnapshot()
    });
})
