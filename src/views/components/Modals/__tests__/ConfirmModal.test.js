import React from 'react';
import { mount, shallow, render } from 'enzyme';
import ConfirmModal from '../ConfirmModal';

const clickFn = jest.fn()

describe('Confirm Modal Test', () => {
    it('render confirm modal', () => {
        const component = shallow(<ConfirmModal />);
        expect(component).toMatchSnapshot()
    });
})
