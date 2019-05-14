import React from 'react';
import { mount, shallow, render } from 'enzyme/build';
import API from '../API';
import {defaultNode} from '../__mock__/defaultNode';
import toJson from 'enzyme-to-json';

const clickFn = jest.fn()

describe('API', () => {
    it('render api editor', () => {
        let node = defaultNode;
        node.name = "API"
        node.extras = {
           body: [],
           bodyInputType: "keyValue",
           content: "",
           failure_id: "",
           headers: [],
           mapping: [],
           method: "GET",
           params: [],
           success_id: "",
           type: "api",
           url:  {blocks: [], entityMap: {}}
        }
        let variables = []
        const component = shallow(<API node={node} variables={variables}/>);
         expect(component.state().node).toEqual(node)
        expect(toJson(component)).toMatchSnapshot()
    });
})
