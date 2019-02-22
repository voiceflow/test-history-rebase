import React from 'react';
import { mount, shallow, render } from 'enzyme';
import EmptyCard from '../EmptyCard';

const clickFn = jest.fn()

describe('Empty Card Test', () => {
    it('render empty card', () => {
        const component = shallow(<EmptyCard />);
        expect(component).toMatchSnapshot()
    });
})
