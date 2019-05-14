import React from 'react';
import { mount, shallow, render } from 'enzyme';
import Multiple from '../Multiple';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('Multiple Form Test', () => {
    let list = ['a', 'b']
    it('render form', () => {
        const component = shallow(<Multiple update={() => {}}/>);
        expect(toJson(component)).toMatchSnapshot()
    });
    it('fill form', () => {
        const handleChange = jest.spyOn(Multiple.prototype, "handleChange");
        const component = mount(<Multiple update={() => {}} list={list} />);
        component.find('.form-control').first().simulate('change', {target: {value:'Voiceflow Tester'}});
        expect(handleChange).toBeCalled()
    });
    it('add and remove form', () => {
        const addField = jest.spyOn(Multiple.prototype, "add");
        const removeField = jest.spyOn(Multiple.prototype, "delete");
        const component = mount(<Multiple update={() => {}} list={list} />)
        component.find('Button').first().simulate('click');
        expect(addField).toBeCalled()
        component.find('button.close').last().simulate('click');
        expect(removeField).toBeCalled()
    })
})
