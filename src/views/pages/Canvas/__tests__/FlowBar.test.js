import React from 'react';
import { mount, shallow, render } from 'enzyme';
import FlowBar from '../FlowBar';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('FlowBar', () => {
    it('render flow bar', () => {
        const component = shallow(<FlowBar />);
        expect(toJson(component)).toMatchSnapshot()
    });
})
