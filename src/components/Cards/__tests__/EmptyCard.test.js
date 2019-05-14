import React from 'react';
import { mount, shallow, render } from 'enzyme';
import EmptyCard from '../EmptyCard';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('Empty Card Test', () => {
    it('render empty card', () => {
        const component = shallow(<EmptyCard />);
        expect(toJson(component)).toMatchSnapshot()
    });
})
