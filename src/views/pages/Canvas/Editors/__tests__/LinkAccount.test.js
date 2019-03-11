import React from 'react';
import { mount, shallow, render } from 'enzyme';
import LinkAccount from './../LinkAccount';
import {testSkill} from './../../__mock__/MockSkill';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('AccountLinkEditor', () => {
    it('render account linking block editor', () => {
        let skill = testSkill
        const component = shallow(<LinkAccount skill={skill}/>);
        expect(toJson(component)).toMatchSnapshot()
    });
})
