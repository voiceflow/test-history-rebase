import React from 'react';
import { mount, shallow, render } from 'enzyme';
import DefaultModal from '../DefaultModal';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('Default Modal Test', () => {
    it('render default modal', () => {
        const component = shallow(<DefaultModal />);
        expect(toJson(component)).toMatchSnapshot()
    });
    it('click button', () => {
        const component = shallow(<DefaultModal toggle={clickFn}/>);
        component.find('Button').simulate('click')
        expect(clickFn).toBeCalled()
    })
    it('click close button', () => {
        const component = shallow(<DefaultModal toggle={clickFn} close_button_text={'test'} />);
        component.find('Button').simulate('click')
        expect(clickFn).toBeCalled()
    })
})
