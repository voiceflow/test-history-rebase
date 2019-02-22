import React from 'react';
import { mount, shallow, render } from 'enzyme';
import ErrorModal from '../ErrorModal';

const clickFn = jest.fn()

describe('Error Modal Test', () => {
    it('render error modal', () => {
        const component = shallow(<ErrorModal error={true}/>);
        expect(component).toMatchSnapshot()
    });
})
