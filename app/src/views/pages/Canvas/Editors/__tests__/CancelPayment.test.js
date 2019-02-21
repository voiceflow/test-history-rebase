import React from 'react';
import { mount, shallow, render } from 'enzyme';
import CancelPayment from './../CancelPayment';

const clickFn = jest.fn()

describe('CancelPayment', () => {
    it('render cancel payment editor', () => {
        const component = shallow(<CancelPayment />);
        expect(component).toMatchSnapshot()
    });
})
