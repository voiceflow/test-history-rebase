import React from 'react';
import { mount, shallow, render } from 'enzyme';
import WarningModal from '../WarningModal';

const clickFn = jest.fn()

describe('Warning Modal Test', () => {
    it('render warning modal', () => {
        const component = shallow(<WarningModal/>);
        expect(component).toMatchSnapshot()
    });
})
