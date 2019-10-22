import { mount, shallow } from 'enzyme';
import _ from 'lodash';
import React from 'react';

import Multiple from '../Multiple';

describe('Multiple Form Test', () => {
  const list = ['a', 'b'];
  it('render form', () => {
    const component = shallow(<Multiple update={_.noop} />);
    expect(component).toMatchSnapshot();
  });
  it('fill form', () => {
    const handleChange = jest.spyOn(Multiple.prototype, 'handleChange');
    const component = mount(<Multiple update={_.noop} list={list} />);
    component
      .find('.form-control')
      .first()
      .simulate('change', { target: { value: 'Voiceflow Tester' } });
    expect(handleChange).toHaveBeenCalled();
  });
  it('add and remove form', () => {
    const addField = jest.spyOn(Multiple.prototype, 'add');
    const removeField = jest.spyOn(Multiple.prototype, 'delete');
    const component = mount(<Multiple update={_.noop} list={list} />);
    component
      .find('Button')
      .first()
      .simulate('click');
    expect(addField).toHaveBeenCalled();
    component
      .find('button.close')
      .last()
      .simulate('click');
    expect(removeField).toHaveBeenCalled();
  });
});
