import { shallow } from 'enzyme';
import React from 'react';

import { ErrorModal } from '../ErrorModal';

describe('Error Modal Test', () => {
  it('render error modal', () => {
    const component = shallow(<ErrorModal error={true} />);
    expect(component).toMatchSnapshot();
  });
});
