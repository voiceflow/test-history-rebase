import React from 'react';
import { mount, shallow, render } from 'enzyme/build';
import Spotlight from '../Spotlight';
import toJson from 'enzyme-to-json';

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
        expect(toJson(component)).toMatchSnapshot()
    });
})
