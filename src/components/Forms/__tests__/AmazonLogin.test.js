import React from 'react';
import { mount, shallow, render } from 'enzyme';
import AmazonLogin from '../AmazonLogin';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('Amazon Login Test', () => {
    it('render empty card', () => {
        const component = shallow(<AmazonLogin />);
        expect(toJson(component)).toMatchSnapshot()
    });
    it('can login', () => {
    const login = jest.spyOn(AmazonLogin.prototype, "triggerLogin");
    const component = shallow(<AmazonLogin updateLogin={() => {}}/>);
    component.find('.LoginWithAmazon').simulate('click')
    expect(login).toBeCalled()
  })
})
