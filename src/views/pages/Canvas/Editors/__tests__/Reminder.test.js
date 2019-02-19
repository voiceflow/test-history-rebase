import React from 'react';
import { mount, shallow, render } from 'enzyme';
import Reminder from './../Reminder';
import {defaultNode} from '../__mock__/defaultNode';

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
        expect(component).toMatchSnapshot()
    });
})
