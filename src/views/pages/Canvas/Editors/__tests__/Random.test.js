import React from 'react';
import { mount, shallow, render } from 'enzyme';
import Random from './../Random';
import {defaultNode} from '../__mock__/defaultNode';

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
        expect(component).toMatchSnapshot()
    });
})
