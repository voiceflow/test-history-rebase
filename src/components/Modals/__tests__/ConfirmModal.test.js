import React from 'react';
import { mount, shallow, render } from 'enzyme';
import {ConfirmModal} from '../ConfirmModal';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('Confirm Modal Test', () => {
    it('render confirm modal', () => {
        const component = shallow(<ConfirmModal />);
        expect(toJson(component)).toMatchSnapshot()
    });
})
