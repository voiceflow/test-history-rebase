import React from 'react';
import { mount, shallow, render } from 'enzyme';
import Dashboard from '../index.jsx';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('Dashboard', () => {
    it('render dashboard', () => {
        const component = shallow(<Dashboard />);
        expect(toJson(component)).toMatchSnapshot()
    });
})

describe('dashboard create skill', () => {
    it ('create new skill', () => {
        global.user_detail = {
            admin: 100,
            email: "jason@getvoiceflow.com",
            first_login: false,
            iat: 1550192538,
            id: 18,
            name: "Jason Zhao",
            verified: null,
        }
        const component = shallow(<Dashboard onClick={clickFn} />)
        component.find('button.btn').simulate('keydown', {keyCode: 32})
        expect(component.props().id).toEqual('app')
        component.unmount()
    })
})
