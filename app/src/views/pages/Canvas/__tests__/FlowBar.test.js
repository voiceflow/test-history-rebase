import React from 'react';
import { mount, shallow, render } from 'enzyme';
import { FlowBar } from '../FlowBar';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()
const diagram = {
    sub_diagrams: ["1", "2", "3"]
}
const diagrams = [
    {
        id: "1",
        name: "diagram_1",
        sub_diagrams: ["2", "3"]
    },
    {
        id: "2",
        name: "diagram_2",
        sub_diagrams: ["1", "3"]
    },
    {
        id: "3",
        name: "diagram_3",
        sub_diagrams: ["1", "2"]
    }
]
describe('FlowBar', () => {
    it('render flow bar', () => {
        const component = shallow(<FlowBar diagram={diagram} diagrams={diagrams} />);
        expect(toJson(component)).toMatchSnapshot()
    });
    it('renders with the correct childDiagrams', () => {
        const component = mount(<FlowBar diagram={diagram} diagrams={diagrams} />);
        console.log(component.debug())
    })
})
