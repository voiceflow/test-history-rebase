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


