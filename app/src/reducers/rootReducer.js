import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import skills from './versionReducer';
import diagramVariables from './diagramVariablesReducer';
import variables from './variableReducer'
import diagrams from './diagramReducer'
import products from './productReducer'
import displays from './displayReducer'
import emails from './emailReducer'
import userSetting from './userReducer'
import modal from './modalReducer'

export default (history) => combineReducers({
    router: connectRouter(history),
    skills,
    products,
    displays,
    emails,
    diagrams,
    variables,
    userSetting,
    diagramVariables,
    modal
})