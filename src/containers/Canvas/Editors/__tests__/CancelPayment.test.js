import React from 'react';
import { mount, shallow, render } from 'enzyme/build';
import CancelPayment from '../CancelPayment';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('CancelPayment', () => {
    it('render cancel payment editor', () => {
        const component = shallow(<CancelPayment />);
        expect(toJson(component)).toMatchSnapshot()
    });
})
