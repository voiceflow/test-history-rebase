import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import { ConfirmModal } from '../ConfirmModal';

describe('Confirm Modal Test', () => {
  it('render confirm modal', () => {
    const component = shallow(<ConfirmModal />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
