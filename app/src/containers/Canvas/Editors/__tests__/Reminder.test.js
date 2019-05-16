import React from 'react';
import { mount, shallow, render } from 'enzyme/build';
import Reminder from '../Reminder';
import {defaultNode} from '../__mock__/defaultNode';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('ReminderEditor', () => {
    it('render reminder block editor', () => {
        let node = defaultNode
        node.name = "Reminder"
        node.extras = {
            reminder: {
                byDay: [],
                date: "",
                freq: null,
                publishNotification: true,
                reminder_type: "SCHEDULED_RELATIVE",
                text: {},
                time: {},
                timezone: "User Timezone"
            },
            type: "reminder"
        }
        const component = shallow(<Reminder node={node}/>);
        expect(toJson(component)).toMatchSnapshot()
    });
})
