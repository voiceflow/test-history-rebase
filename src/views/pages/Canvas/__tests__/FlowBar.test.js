import React from 'react';
import { mount, shallow, render } from 'enzyme';
import FlowBar from '../FlowBar';

const clickFn = jest.fn()

describe('FlowBar', () => {
    it('render flow bar', () => {
        const component = shallow(<FlowBar />);
        expect(component).toMatchSnapshot()
    });
})
