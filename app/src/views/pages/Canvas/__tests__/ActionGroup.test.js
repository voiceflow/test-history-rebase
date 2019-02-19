import React from 'react';
import { mount, shallow, render } from 'enzyme';
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

describe('Upload Button', () => {
    it ('user can upload to alexa', () => {
        let skill = testSkill
        const component = shallow(<ActionGroup onClick={clickFn} skill={skill} />)
        component.find('.publish-btn').simulate('keydown', {keyCode: 32})

        expect(component).toMatchSnapshot();
        component.unmount()
    })
})

describe('Save Button', () => {
    it ('user can upload to alexa', () => {
        let skill = testSkill
        const component = shallow(<ActionGroup onClick={clickFn} skill={skill} />)
        component.find('#icon-save').simulate('keydown', {keyCode: 32})

        expect(component).toMatchSnapshot();
        component.unmount()
    })
})
