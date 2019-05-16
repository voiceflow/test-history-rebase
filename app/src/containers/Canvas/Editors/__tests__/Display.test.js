import React from 'react';
import { mount, shallow, render } from 'enzyme/build';
import { Display } from '../Display';
import {defaultNode} from '../__mock__/defaultNode';
import {testSkill} from '../../__mock__/MockSkill';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('DisplayEditor', () => {
    it('render display block editor', () => {
        let node = defaultNode;
        node.name = "Display"
        node.extras = {
            datasource: "",
            display_id: null,
            type: "display",
            update_on_change: false,
        }
        let skill = testSkill
        let display = []
        const component = shallow(<Display node={node} displays={display} skill={testSkill}/>);
        expect(component.state().node).toEqual(node)
        expect(toJson(component)).toMatchSnapshot()
    });
})
