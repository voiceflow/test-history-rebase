import React from 'react';
import { mount, shallow, render } from 'enzyme/build';
import { Blocks } from '../Blocks';
import toJson from 'enzyme-to-json';

describe('SideBar Blocks', () => {
    it('render sidebar blocks on admin 100', () => {
        global.user_detail = {
            admin: 100
        }
        const component = shallow(<Blocks />);
        expect(toJson(component)).toMatchSnapshot()
        component.unmount()
    });
    it('render sidebar blocks on admin 0', () => {
        global.user_detail = {
            admin: 0
        }
        const component = shallow(<Blocks />)
        expect(toJson(component)).toMatchSnapshot()
        component.unmount()
    })
})

