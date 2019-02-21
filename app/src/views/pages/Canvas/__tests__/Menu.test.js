import React from 'react';
import { mount, shallow, render } from 'enzyme';
import Menu from './../Menu';
import _ from 'lodash';

const clickFn = jest.fn()

describe('Menu', () => {
    it('render menu', () => {
        const component = shallow(<Menu build={() => {}} />);
        expect(component).toMatchSnapshot()
    });
})
