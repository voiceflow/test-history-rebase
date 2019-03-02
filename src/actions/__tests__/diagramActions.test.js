import configureStore from 'redux-mock-store';
import thunk from "redux-thunk";
import * as actions from '../diagramActions'

const middlewares = [thunk]
const mockStore = configureStore(middlewares);
const store = mockStore();

describe('Diagram Actions Test', () => {
    beforeEach(() => {
        store.clearActions();
    })
    test('dispatches fetch diagram (failure)', () => {
        const expectedAction = [
            {
                type: "FETCH_DIAGRAM_BEGIN"
            },
            {
                type: "FETCH_DIAGRAM_FAILURE",
                payload: {
                    error: "Could Not Retrieve Project Diagrams"
                }
            }
        ]
        return store.dispatch(actions.fetchDiagram(1)).then(() => {
            expect(store.getActions()).toEqual(expectedAction)
        })
    })
})