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
import project from 'ducks/project'
import modal from 'ducks/modal'
import team from 'ducks/team'
import account from 'ducks/account'

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
  project,
  modal,
  team,
  account
})