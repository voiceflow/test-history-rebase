import React from 'react';
import { mount, shallow, render } from 'enzyme';
import _ from 'lodash'
import { ActionGroup } from '../ActionGroup';
import {testSkill} from './../__mock__/MockSkill';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

const account = {
  id: 1,
  image: '26A69A|EBF7F5',
  name: 'John Doe',
  email: 'jdoe@gmail.com'
}

describe('ActionGroup', () => {
    it('render action group/top nav bar', () => {
        let skill = testSkill
        const component = shallow(<ActionGroup skill={skill} user={account} platform="alexa" />);
        expect(toJson(component)).toMatchSnapshot()
    });
})

describe('Buttons test', () => {
    it ('user can upload to alexa', () => {
        let skill = testSkill
        const spy = jest.spyOn(ActionGroup.prototype, "openUpdate")
        const component = shallow(<ActionGroup onClick={clickFn} skill={skill} user={account} setCB={() => {}} onSave={() => {}} platform="alexa"/>)
        component.find('.publish-btn').simulate('click')
        expect(spy).toHaveBeenCalled()
    });
    it ('user can upload to alexa', () => {
        let skill = testSkill
        const component = shallow(<ActionGroup onSave={clickFn} skill={skill} user={account} platform="alexa" />)
        component.find('#icon-save').simulate('click')

        expect(clickFn).toHaveBeenCalled()
        setTimeout(() => {
            expect(component.exists('.modal')).toBe(true);
            component.find('.modal .modal-body button.btn-primary').simulate('click')
        }, 500);
    });
})

