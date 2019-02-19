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
