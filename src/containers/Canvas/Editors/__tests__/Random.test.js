import React from 'react';
import { mount, shallow, render } from 'enzyme/build';
import Random from '../Random';
import {defaultNode} from '../__mock__/defaultNode';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('RandomEditor', () => {
    it('render random block editor', () => {
        let node = defaultNode
        node.name = "Random"
        node.extras = {
            paths: 1,
            type: "random"
        }
        const component = shallow(<Random node={node}/>);
        expect(component.state().node).toEqual(node)
        expect(toJson(component)).toMatchSnapshot()
    });
})
