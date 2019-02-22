import React from 'react';
import { mount, shallow, render } from 'enzyme';
import MultipleFields from '../MultipleFields';

const clickFn = jest.fn()

describe('Multiple Field Test', () => {
    it('multiple fields', () => {
        const component = shallow(<MultipleFields />);
        expect(component).toMatchSnapshot()
    });
})
