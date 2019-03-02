import React from 'react';
import { mount, shallow, render } from 'enzyme';
import UpgradeModal from '../UpgradeModal';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('Upgrade Modal Test', () => {
    it('render upgrade modal', () => {
        const component = shallow(<UpgradeModal/>);
        expect(toJson(component)).toMatchSnapshot()
    });
})
