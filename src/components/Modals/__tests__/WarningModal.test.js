import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import WarningModal from '../WarningModal';

describe('Warning Modal Test', () => {
  it('render warning modal', () => {
    const component = shallow(<WarningModal />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
