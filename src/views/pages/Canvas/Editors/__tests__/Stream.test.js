import React from 'react';
import { mount, shallow, render } from 'enzyme';
import Stream from './../Stream';
import {defaultNode} from '../__mock__/defaultNode';

const clickFn = jest.fn()

describe('StreamEditor', () => {
    it('render stream block editor', () => {
        let node = defaultNode
        node.name = "Stream"
        node.extras = {
            type: "stream",
            audio: "",
        }
        const component = shallow(<Stream node={node}/>);
        expect(component).toMatchSnapshot()
    });
})
