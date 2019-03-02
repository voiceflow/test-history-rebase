import React from 'react';
import { mount, shallow, render } from 'enzyme';
import VoiceCards from '../VoiceCards';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('Voice Card Test', () => {
    it('render empty card', () => {
        const component = shallow(<VoiceCards />);
        expect(toJson(component)).toMatchSnapshot()
    });
})
