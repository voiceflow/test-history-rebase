import React from 'react';
import { mount, shallow, render } from 'enzyme/build';
import toJson from 'enzyme-to-json';
import { Permissions } from '../Permissions';
import {defaultNode} from '../__mock__/defaultNode';

const clickFn = jest.fn()

describe('PermissionsEditor', () => {
    it('render permissions block editor', () => {
        let node = defaultNode;
        node.name = "Permissions"
        node.extras = {
            permissions: [],
            type: "permission"
        }
        const component = shallow(<Permissions node={node}/>);
        expect(component.state().node).toEqual(node)
        expect(toJson(component)).toMatchSnapshot()
    });
})
