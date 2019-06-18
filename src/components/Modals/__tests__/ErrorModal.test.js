import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import { ErrorModal } from '../ErrorModal';

describe('Error Modal Test', () => {
  it('render error modal', () => {
    const component = shallow(<ErrorModal error={true} />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
