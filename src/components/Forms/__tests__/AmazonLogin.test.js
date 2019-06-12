import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import _ from 'lodash';
import React from 'react';

import AmazonLogin from '../AmazonLogin';

describe('Amazon Login Test', () => {
  it('render empty card', () => {
    const component = shallow(<AmazonLogin />);
    expect(toJson(component)).toMatchSnapshot();
  });
  it('can login', () => {
    const login = jest.spyOn(AmazonLogin.prototype, 'triggerLogin');
    const component = shallow(<AmazonLogin updateLogin={_.noop} />);
    component.find('.LoginWithAmazon').simulate('click');
    expect(login).toHaveBeenCalled();
  });
});
