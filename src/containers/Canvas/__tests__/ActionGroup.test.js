import { shallow } from 'enzyme/build';
import _ from 'lodash';
import React from 'react';

import { testSkill } from '../__mock__/MockSkill';
import ActionGroup from '../components/ActionGroup/ActionGroup';

const account = {
  id: 1,
  image: '26A69A|EBF7F5',
  name: 'John Doe',
  email: 'jdoe@gmail.com',
};

// eslint-disable lodash/prefer-constant
describe('ActionGroup', () => {
  it('render action group/top nav bar', () => {
    const component = shallow(
      <ActionGroup
        skill={testSkill}
        user={account}
        showSettings={{ show: false, tag: 'basic' }}
        vendors={[]}
        unfocus={_.noop}
        platform="alexa"
        setCB={_.noop}
        onSave={_.noop}
      />
    );

    expect(component).toMatchSnapshot();
  });
});
