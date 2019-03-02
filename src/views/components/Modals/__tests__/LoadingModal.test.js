import React from 'react';
import { mount, shallow, render } from 'enzyme';
import LoadingModal from '../LoadingModal';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('Loading Modal Test', () => {
    it('render loading modal', () => {
        const component = shallow(<LoadingModal/>);
        expect(toJson(component)).toMatchSnapshot()
    });
})
