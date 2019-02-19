import React from 'react';
import { mount, shallow, render } from 'enzyme';
import Spotlight from './../Spotlight';

const clickFn = jest.fn()

describe('Spotlight', () => {
    it('render spotlight', () => {
        global.user_detail = {
            admin: 100,
            email: "jason@getvoiceflow.com",
            first_login: false,
            iat: 1550192538,
            id: 18,
            name: "Jason Zhao",
            verified: null,
        }
        const component = shallow(<Spotlight />);
        expect(component).toMatchSnapshot()
    });
})
