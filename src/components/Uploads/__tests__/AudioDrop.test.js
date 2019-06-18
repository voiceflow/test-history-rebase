import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import AudioDrop from '../AudioDrop';
import testaudio from '../__mocks__/audiotest.wav';

const updateFn = jest.fn();

describe('Audio Drop Test', () => {
  it('render audio drop', () => {
    const component = shallow(<AudioDrop />);
    expect(toJson(component)).toMatchSnapshot();
  });
  it('drop audio', () => {
    const drop = jest.spyOn(AudioDrop.prototype, 'onDrop');
    const component = shallow(<AudioDrop update={updateFn} />);
    component.instance().onDrop(testaudio);
    expect(drop).toHaveBeenCalled();
  });
});
