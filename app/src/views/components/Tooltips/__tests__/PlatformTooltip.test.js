import React from 'react';
import { mount, shallow, render } from 'enzyme';
import PlatformTooltip from '../PlatformTooltip';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('Platform tooltip Test', () => {
    it('render platform tooltip', () => {
        const component = shallow(<PlatformTooltip/>);
        expect(toJson(component)).toMatchSnapshot()
    });
})
