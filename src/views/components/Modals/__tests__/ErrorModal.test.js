import React from 'react';
import { mount, shallow, render } from 'enzyme';
import {ErrorModal} from '../ErrorModal';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('Error Modal Test', () => {
    it('render error modal', () => {
        const component = shallow(<ErrorModal error={true}/>);
        expect(toJson(component)).toMatchSnapshot()
    });
})
