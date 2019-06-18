import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import GoogleAuthenticationModalContent from '../GoogleAuthenticationModalContent';

describe('Render Google Auth Modal Test', () => {
  it('render default modal', () => {
    const component = shallow(<GoogleAuthenticationModalContent />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
