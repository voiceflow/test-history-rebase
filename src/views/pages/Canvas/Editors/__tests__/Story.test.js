import React from 'react';
import { mount, shallow, render } from 'enzyme';
import Story from './../Story';

const clickFn = jest.fn()

describe('StoryEditor', () => {
    it('render story block editor', () => {
        const component = shallow(<Story />);
        expect(component).toMatchSnapshot()
    });
})
