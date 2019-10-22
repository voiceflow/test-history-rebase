import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import LoadingModal from '../LoadingModal';

describe('Loading Modal Test', () => {
  it('render loading modal', () => {
    const component = shallow(<LoadingModal />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
