import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import DefaultModal from '../DefaultModal';

const clickFn = jest.fn();

describe('Default Modal Test', () => {
  it('render default modal', () => {
    const component = shallow(<DefaultModal />);
    expect(toJson(component)).toMatchSnapshot();
  });
  it('click button', () => {
    const component = shallow(<DefaultModal toggle={clickFn} />);
    component.find('Button').simulate('click');
    expect(clickFn).toHaveBeenCalled();
  });
  it('click close button', () => {
    const component = shallow(<DefaultModal toggle={clickFn} close_button_text="test" />);
    component.find('Button').simulate('click');
    expect(clickFn).toHaveBeenCalled();
  });
});
