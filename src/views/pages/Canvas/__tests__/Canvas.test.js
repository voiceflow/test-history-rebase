import React from 'react';
import { mount, shallow, render } from 'enzyme';
import Canvas from '../index.jsx';
import {testSkill} from './../__mock__/MockSkill';

const clickFn = jest.fn()

describe('Canvas', () => {
    it('render canvas', () => {
        let skill = testSkill
        const component = shallow(<Canvas skill={skill}/>);
        expect(component).toMatchSnapshot()
        component.unmount()
    });
    
})

