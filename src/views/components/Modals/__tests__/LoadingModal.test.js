import React from 'react';
import { mount, shallow, render } from 'enzyme';
import LoadingModal from '../LoadingModal';

const clickFn = jest.fn()

describe('Loading Modal Test', () => {
    it('render loading modal', () => {
        const component = shallow(<LoadingModal/>);
        expect(component).toMatchSnapshot()
    });
})
