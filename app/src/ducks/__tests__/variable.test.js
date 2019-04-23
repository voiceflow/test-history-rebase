import variableReducer, * as actions from './../variable'

describe('Test Variables Reducer', () => {
    it('render initial variable state', () => {
        expect(variableReducer(undefined, {})).toEqual({
            localVariables: [],
        })
    });

    it('should handle PUSH_VARIABLES', () => {
        const pushVariable = {
            type: actions.PUSH_VARIABLE,
            payload: {variable: 'test_variable'}
        }
        expect(variableReducer({localVariables: []}, pushVariable)).toEqual({
            localVariables: ['test_variable']
        })
    });

    it('should handle SET_VARIABLES', () => {
        const setVariables = {
            type: actions.SET_VARIABLES,
            payload: {variables: ['a', 'b', 'c']}
        }
        expect(variableReducer([], setVariables)).toEqual({
            localVariables: ['a', 'b', 'c']
        })
    })
})