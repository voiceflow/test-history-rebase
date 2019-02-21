import React from 'react';
import { mount, shallow, render } from 'enzyme';
import Payment from './../Payment';

const clickFn = jest.fn()

describe('PaymentEditor', () => {
    it('render payment block editor', () => {
        const component = shallow(<Payment />);
        expect(component).toMatchSnapshot()
    });
})
