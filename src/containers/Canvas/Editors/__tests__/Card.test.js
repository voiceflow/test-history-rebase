import React from 'react';
import { mount, shallow, render } from 'enzyme/build';
import Card from '../Card';
import {defaultNode} from '../__mock__/defaultNode';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('Card', () => {
    it('render card block editor', () => {
        let node = defaultNode
        node.name = "Card"
        node.extras = {
            cardtype: "Simple",
            content: {},
            title: {},
            type: "card"
        }
        const component = shallow(<Card node={node}/>);
         expect(component.state().node).toEqual(node)
        expect(toJson(component)).toMatchSnapshot()
    });
})
