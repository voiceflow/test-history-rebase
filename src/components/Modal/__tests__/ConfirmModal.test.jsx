import { shallow } from 'enzyme';
import React from 'react';

import { ConfirmModal } from '../ConfirmModal';

describe('Confirm Modal Test', () => {
  it('render confirm modal', () => {
    const component = shallow(<ConfirmModal />);
    expect(component).toMatchSnapshot();
  });
});
