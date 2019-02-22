import React from 'react';
import { mount, shallow, render } from 'enzyme';
import PlatformTooltip from '../PlatformTooltip';

const clickFn = jest.fn()

describe('Platform tooltip Test', () => {
    it('render platform tooltip', () => {
        const component = shallow(<PlatformTooltip/>);
        expect(component).toMatchSnapshot()
    });
})
