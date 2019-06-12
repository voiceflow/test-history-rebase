import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import Reminder from '../Reminder';
import { defaultNode } from '../__mock__/defaultNode';

describe('ReminderEditor', () => {
  it('render reminder block editor', () => {
    const node = defaultNode;
    node.name = 'Reminder';
    node.extras = {
      reminder: {
        byDay: [],
        date: '',
        freq: null,
        publishNotification: true,
        reminder_type: 'SCHEDULED_RELATIVE',
        text: {},
        time: {},
        timezone: 'User Timezone',
      },
      type: 'reminder',
    };
    const component = shallow(<Reminder node={node} />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
