import React from 'react';
import { mount, shallow, render } from 'enzyme';
import { Variables } from '../Variables';
import toJson from 'enzyme-to-json';

const globalVariables = [
    "sessions",
    "user_id",
    "timestamp",
    "platform",
    "locale"
]

const mockLocalStorage = {
    store: {variable_tab: 'global'},
    getItem: key => this.store[key],
    setItem: (key, value) => this.store[key] = value
}
describe('Sidebar Variables', () => {
    it('render variable sidebar on global', () => {
        global.storage = mockLocalStorage
        const component = shallow(<Variables global_variables={globalVariables} />);
        expect(toJson(component)).toMatchSnapshot()
        component.unmount()
    });
    it('render variable sidebar on local', () => {
        mockLocalStorage.store.variable_tab = 'local'
        global.storage = mockLocalStorage
        const component = shallow(<Variables global_variables={globalVariables} />)
        expect(toJson(component)).toMatchSnapshot()
        component.unmount()
    })
    it('test add variable', () => {
        const fakeEvent = { preventDefault: () => jest.fn() }
        const addGlobalVariable = jest.spyOn(Variables.prototype, "addGlobalVariable");
        const component = shallow(<Variables global_variables={globalVariables} locked={false} variables={[]} setError={jest.fn()} />)
        expect(component.find('.form-control-border').length).toBe(1);
        component.find('.form-control-border').simulate('change', {target: {value: 'testvariable'}});
        expect(component.find('#variable-submit').length).toBe(1);
        component.find('form#variable-submit').simulate('submit', fakeEvent)
        expect(addGlobalVariable).toHaveBeenCalled()
    })
    // it('test add global variable', () => {
    //     const addGlobalVariable = jest.spyOn(Variables.prototype, "addGlobalVariable")
    // })
})

