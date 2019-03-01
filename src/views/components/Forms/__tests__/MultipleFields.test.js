import React from 'react';
import { mount, shallow, render } from 'enzyme';
import MultipleFields from '../MultipleFields';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('Multiple Field Test', () => {
    it('multiple fields', () => {
        const component = shallow(<MultipleFields />);
        expect(toJson(component)).toMatchSnapshot()
    });
})
