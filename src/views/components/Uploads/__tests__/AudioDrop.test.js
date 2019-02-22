import React from 'react';
import { mount, shallow, render } from 'enzyme';
import AudioDrop from '../AudioDrop';
import testaudio from '../__mocks__/testaudio.wav';

const updateFn = jest.fn()

describe('Audio Drop Test', () => {
    it('render audio drop', () => {
        const component = shallow(<AudioDrop/>);
        expect(component).toMatchSnapshot()
    });
    it('drop audio', () => {
        let drop = jest.spyOn(AudioDrop.prototype, "onDrop")
        const component = shallow(<AudioDrop update={updateFn}/>)
        component.instance().onDrop(testaudio)
        expect(drop).toBeCalled()
    });
})
