import React from 'react';
import { mount, shallow, render } from 'enzyme';
import GoogleAuthenticationModalContent from '../GoogleAuthenticationModalContent';

const clickFn = jest.fn()

describe('Render Google Auth Modal Test', () => {
    it('render default modal', () => {
        const component = shallow(<GoogleAuthenticationModalContent />);
        expect(component).toMatchSnapshot()
    });
})
