import diagramReducer from '../diagramReducer'
import * as actions from '../../actions/diagramActions'

describe('Test Diagram Reducer', () => {
    it('render initial diagramstate', () => {
        expect(diagramReducer(undefined, {})).toEqual({
            diagrams: [],
            loading: false,
            error: null
        })
    });

    it('should handle FETCH_DIAGRAMS_BEGIN', () => {
        const beginFetch = {
            type: actions.FETCH_DIAGRAMS_BEGIN
        }
        expect(diagramReducer(undefined, beginFetch)).toEqual({
            diagrams: [],
            loading: true,
            error: null
        })
    })

    it('should handle FETCH_DIAGRAMS_SUCCESS', () => {
        const diagrams = [{
                id: '1',
                name: 'ROOT',
                sub_diagrams: []
            },
            {
                id: '2',
                name: 'SUB_FLOW',
                sub_diagrams: []
            }
        ]
        const getDiagrams = {
            type: actions.FETCH_DIAGRAMS_SUCCESS,
            payload: {diagrams: diagrams }
        }
        expect(diagramReducer(undefined, getDiagrams)).toEqual({
            diagrams: diagrams,
            error: null,
            loading: false
        })
    })

    it('should handle FETCH_DIAGRAMS_FAILURE', () => {
        const fail = {
            type: actions.FETCH_DIAGRAMS_FAILURE,
            payload: { error: true }
        }
        expect(diagramReducer({}, fail)).toEqual({
            loading: false,
            error: true,
            diagrams: []
        })
    })

    it('should handle ON_FLOW_RENAME', () => {
        const rename = {
            type: actions.ON_FLOW_RENAME,
            payload: {flow_id: 1, name: 'test'}
        }
        expect(diagramReducer({diagrams: [{id: 1, name: 'default'}]}, rename)).toEqual({
            diagrams: [
                {
                    id: 1,
                    name: 'test'
                }
            ]
        })
    })
})