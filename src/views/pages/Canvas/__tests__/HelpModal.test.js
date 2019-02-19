import React from 'react';
import { mount, shallow, render } from 'enzyme';
import HelpModal from './../HelpModal';

const clickFn = jest.fn()

describe('HelpModal', () => {
    it('render help modal', () => {
        const component = shallow(<HelpModal />);
        expect(component).toMatchSnapshot()
    });
})
