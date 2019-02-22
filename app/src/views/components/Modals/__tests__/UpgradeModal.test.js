import React from 'react';
import { mount, shallow, render } from 'enzyme';
import UpgradeModal from '../UpgradeModal';

const clickFn = jest.fn()

describe('Upgrade Modal Test', () => {
    it('render upgrade modal', () => {
        const component = shallow(<UpgradeModal/>);
        expect(component).toMatchSnapshot()
    });
})
