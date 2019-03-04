import React from 'react';
import { mount, shallow, render } from 'enzyme';
import { Canvas } from '../index.jsx';
import {testSkill} from './../__mock__/MockSkill';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()
const setOnSave = jest.fn()

describe('Canvas', () => {
    it('render canvas', () => {
        let skill = testSkill
        const component = shallow(<Canvas skill={skill} setOnSave={setOnSave} />);
        expect(toJson(component)).toMatchSnapshot()
        component.unmount()
    });
    it('auto save test', () => {
        let skill = testSkill
        const spy = jest.spyOn(Canvas.prototype, "onSave");
        const unmount = jest.spyOn(Canvas.prototype, "componentWillUnmount");
        const diagram_id = "e9f52b0622f08ff1b21137bae05a242b"
        const component = shallow(<Canvas skill={skill} diagram_id={diagram_id} onError={() => {}} updateSkill={() => {}} setOnSave={setOnSave} />);
        component.unmount();
        expect(unmount).toHaveBeenCalled()
        expect(spy).toHaveBeenCalled()
    })
})

