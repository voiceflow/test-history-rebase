import React from 'react';
import { mount, shallow, render } from 'enzyme';
import Mail from './../Mail';
import {defaultNode} from '../__mock__/defaultNode';
import {testSkill} from './../../__mock__/MockSkill';

const clickFn = jest.fn()

describe('MailEditor', () => {
    it('render mail block editor', () => {
        let node = defaultNode
        node.name = "Mail"
        node.extras = {
            mapping: [],
            template_id: null,
            to: "",
            type: "mail"
        }
        let skill = testSkill
        let templates = []
        const component = shallow(<Mail node={node} templates={templates} skill={skill}/>);
        expect(component).toMatchSnapshot()
    });
})
