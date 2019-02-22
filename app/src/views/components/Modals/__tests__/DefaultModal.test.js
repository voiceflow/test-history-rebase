import React from 'react';
import { mount, shallow, render } from 'enzyme';
import DefaultModal from '../DefaultModal';

const clickFn = jest.fn()

describe('Default Modal Test', () => {
    it('render default modal', () => {
        const component = shallow(<DefaultModal />);
        expect(component).toMatchSnapshot()
    });
    it('click button', () => {
        const component = shallow(<DefaultModal toggle={clickFn}/>);
        component.find('.purple-btn').simulate('click')
        expect(clickFn).toBeCalled()
    })
})
