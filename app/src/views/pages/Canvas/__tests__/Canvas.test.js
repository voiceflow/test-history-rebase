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
    it('component state tests', () => {
        let skill = testSkill
        const component = shallow(<Canvas skill={skill}/>);
        expect(component.state().skill).toEqual(skill);
    })
    it('auto save test', () => {
        let skill = testSkill
        const spy = jest.spyOn(Canvas.prototype, "onSave");
        const unmount = jest.spyOn(Canvas.prototype, "componentWillUnmount");
        const diagram_id = "e9f52b0622f08ff1b21137bae05a242b"
        const component = shallow(<Canvas skill={skill} diagram_id={diagram_id} onError={() => {}}/>);
        component.unmount();
        expect(unmount).toHaveBeenCalled()
        expect(spy).toHaveBeenCalled()
    })
})

