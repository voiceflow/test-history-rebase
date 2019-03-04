import React from 'react';
import { mount, shallow, render } from 'enzyme';
import GoogleAuthenticationModalContent from '../GoogleAuthenticationModalContent';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('Render Google Auth Modal Test', () => {
    it('render default modal', () => {
        const component = shallow(<GoogleAuthenticationModalContent />);
        expect(toJson(component)).toMatchSnapshot()
    });
})
