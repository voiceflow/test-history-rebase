import React from 'react';
import { mount, shallow, render } from 'enzyme/build';
import { WidgetBar} from '../WidgetBar';
import toJson from 'enzyme-to-json';

describe('Widget Bar', () => {
    it('render canvas widget bar', () => {
        const component = shallow(<WidgetBar />);
        expect(toJson(component)).toMatchSnapshot()
        component.unmount()
    });
})

