import React from 'react';
import { mount, shallow, render } from 'enzyme';
import Story from './../Story';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('StoryEditor', () => {
    it('render story block editor', () => {
        const component = shallow(<Story />);
        expect(toJson(component)).toMatchSnapshot()
    });
})
