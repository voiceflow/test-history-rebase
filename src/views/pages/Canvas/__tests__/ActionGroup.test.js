import React from 'react';
import { mount, shallow, render } from 'enzyme';
import _ from 'lodash'
import ActionGroup from '../ActionGroup';
import {testSkill} from './../__mock__/MockSkill';

const clickFn = jest.fn()

describe('ActionGroup', () => {
    it('render action group/top nav bar', () => {
        let skill = testSkill
        const component = shallow(<ActionGroup skill={skill}/>);
        expect(component).toMatchSnapshot()
    });
})

describe('Buttons test', () => {
    it ('user can upload to alexa', () => {
        let skill = testSkill
        const spy = jest.spyOn(ActionGroup.prototype, "openUpdate")
        const component = shallow(<ActionGroup onClick={clickFn} skill={skill} setCB={() => {}} onSave={() => {}}/>)
        component.find('.publish-btn').simulate('click')
        expect(spy).toHaveBeenCalled()
    });
    it ('user can upload to alexa', () => {
        let skill = testSkill
        const component = shallow(<ActionGroup onSave={clickFn} skill={skill}/>)
        component.find('#icon-save').simulate('click')

        expect(clickFn).toHaveBeenCalled()
        component.unmount()
    })
})

