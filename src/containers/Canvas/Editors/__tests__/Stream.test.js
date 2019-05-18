import React from 'react';
import { mount, shallow, render } from 'enzyme/build';
import Stream from '../Stream';
import {defaultNode} from '../__mock__/defaultNode';
import toJson from 'enzyme-to-json';

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
        expect(component.state().node).toEqual(node)
        expect(toJson(component)).toMatchSnapshot()
    });
})
