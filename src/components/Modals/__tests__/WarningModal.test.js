import React from 'react';
import { mount, shallow, render } from 'enzyme';
import WarningModal from '../WarningModal';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('Warning Modal Test', () => {
    it('render warning modal', () => {
        const component = shallow(<WarningModal/>);
        expect(toJson(component)).toMatchSnapshot()
    });
})
