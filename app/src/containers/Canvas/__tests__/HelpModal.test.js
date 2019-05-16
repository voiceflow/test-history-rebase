import React from 'react';
import { mount, shallow, render } from 'enzyme/build';
import HelpModal from '../HelpModal';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('HelpModal', () => {
    it('render help modal', () => {
        const component = shallow(<HelpModal />);
        expect(toJson(component)).toMatchSnapshot()
    });
})
