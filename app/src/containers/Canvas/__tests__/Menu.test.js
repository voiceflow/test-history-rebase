import React from 'react';
import { mount, shallow, render } from 'enzyme/build';
import Menu from '../Menu';
import _ from 'lodash';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('Menu', () => {
    it('render menu', () => {
        const component = shallow(<Menu build={() => {}} />);
        expect(toJson(component)).toMatchSnapshot()
    });
})
