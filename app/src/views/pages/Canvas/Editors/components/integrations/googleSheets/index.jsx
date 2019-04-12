import React from 'react'
import IntegrationsService from 'services/Integrations'
import _ from 'lodash'
import './googleSheets.css'
import randomstring from 'randomstring'
import IntegrationBase from '../integrationBase'

import { connect } from 'react-redux'
import { setConfirm, clearModal, setError } from 'ducks/modal'
import update from 'immutability-helper'

import RetrieveDataSection from './actions/retrieveDataSection'
import CreateDataSection from './actions/createDataSection'
import UpdateDataSection from './actions/updateDataSection'
import DeleteDataSection from './actions/deleteDataSection'

import SpreadsheetSection from './spreadsheetSection'
import GoogleAddUserModal from './addUserModal'

import ActionSection from '../actionSection'
import UserSection from '../userSection'
import OutputSection from '../outputSection'
import TestSection from '../testSection'

import C from './constants'

class GoogleSheets extends IntegrationBase {

  constructor(props) {
    super(props)

    this.state = {
      spreadsheet: null
    }

    this.integration = C.GOOGLE_SHEETS
    this.integration_info = {
      actions: {
        [C.RETRIEVE_DATA]: {
          sections: [
            C.ACTIONS_SECTION,
            C.USER_SECTION,
            C.SPREADSHEET_SECTION,
            C.RETRIEVE_OPTIONS_SECTION,
            C.OUTPUT_SECTION,
            C.TESTING_SECTION
          ],
          tooltip: 'Retrieve a Single Row from a Spreadsheet'
        },
        [C.CREATE_DATA]: {
          sections: [
            C.ACTIONS_SECTION,
            C.USER_SECTION,
            C.SPREADSHEET_SECTION,
            C.CREATE_OPTIONS_SECTION,
            C.TESTING_SECTION
          ],
          tooltip: 'Create a Row in a Spreadsheet'
        },
        [C.UPDATE_DATA]: {
          sections: [
            C.ACTIONS_SECTION,
            C.USER_SECTION,
            C.SPREADSHEET_SECTION,
            C.UPDATE_OPTIONS_SECTION,
            C.TESTING_SECTION
          ],
          tooltip: 'Update an Existing Row in a Spreadsheet'
        },
        [C.DELETE_DATA]: {
          sections: [
            C.ACTIONS_SECTION,
            C.USER_SECTION,
            C.SPREADSHEET_SECTION,
            C.DELETE_OPTIONS_SECTION,
            C.TESTING_SECTION
          ],
          tooltip: 'Delete Rows in a Spreadsheet'
        }
      },
      addUserModal: GoogleAddUserModal
    }
    this.actionsRequiringConfirm = [
      C.UPDATE_DATA,
      C.DELETE_DATA
    ]
  }

  componentDidMount() {
    if (!this.props.integration_data.selected_action) {
      this.setState({
        active_section: C.ACTIONS_SECTION
      })
    }
    this.updateHeaders()
  }

  componentWillUnmount() {
    delete this.currentUpdateRequest
  }

  updateActionData = (d, callback) => {
    const integration_data = this.props.integration_data
    const action = integration_data.selected_action
    const action_data = integration_data.actions_data[action]

    const updateSpec = {}
    Object.keys(d).forEach(k => {
      if (!_.isNil(d[k]) || !_.isNil(action_data[k])) {
        updateSpec[k] = {
          $set: d[k]
        }
      }
    })

    const newActionData = update(action_data, updateSpec)

    const newIntegrationData = update(this.props.integration_data, {
      actions_data: {
        [action]: {
          $set: newActionData
        }
      }
    })

    this.props.updateIntegrationData(newIntegrationData, callback)
  }

  updateHeaders = async () => {
    this.setState({
      headers_list: []
    })

    const action = this.props.integration_data.selected_action
    const action_data = action && this.props.integration_data.actions_data[action]

    if (!action_data) return

    const spreadsheet_id = action_data.spreadsheet && action_data.spreadsheet.value
    const sheet_id = action_data.sheet && action_data.sheet.value
    const user = this.props.integration_data.user

    if (_.isNil(spreadsheet_id) || _.isNil(sheet_id) || _.isNil(user)) return

    this.setState({
      headers_loading: true
    })

    const requestId = randomstring.generate(10)
    this.currentUpdateRequest = requestId

    try {
      const headers = await IntegrationsService.googleSheets.getSheetHeaders(spreadsheet_id, sheet_id, user, window.user_detail.id, this.props.skill_id)

      if (this.currentUpdateRequest === requestId) {
        this.setState({
          headers_list: headers,
          headers_loading: false
        })
      }
    } catch (e) {
      if (this.currentUpdateRequest === requestId) {
        this.setState({
          headers_loading: false
        })
        this.props.setError(new Error('Blank or invalid headers in spreadsheet. The first row of your spreadsheet must be a header row'))
      }
    }
  }

  userChanged = () => {
    this.updateActionData({
      spreadsheet: null,
      sheet: null
    })
    delete this.currentUpdateRequest
  }

  render() {
    const action = this.props.integration_data.selected_action
    const sections_list = action ? this.integration_info.actions[action].sections : [C.ACTIONS_SECTION, C.USER_SECTION]

    const action_data = action && this.props.integration_data.actions_data[action]
    const user = this.props.integration_data.user

    return (
      <div className='w-100'>
        {sections_list.map((section, i) => {
          let component

          switch (section) {
            case C.ACTIONS_SECTION:
              component = <ActionSection
                integration_data={this.props.integration_data}
                selected_action={action}
                all_actions={this.integration_info.actions}
                toggleSection={() => this.showSection(section)}
                open={this.state.active_section === C.ACTIONS_SECTION}
                updateIntegrationData={this.props.updateIntegrationData}
                showNextSection={() => i + 2 > sections_list.length || this.showSection(sections_list[i + 1])}
              />
              break
            case C.USER_SECTION:
              component = <UserSection
                user_modal={GoogleAddUserModal}
                action_data={action_data}
                integration_data={this.props.integration_data}
                user={user}
                selected_integration={this.props.selected_integration}
                toggleSection={() => this.showSection(section)}
                userChanged={this.userChanged}
                open={this.state.active_section === C.USER_SECTION}
                updateIntegrationData={this.props.updateIntegrationData}
                showNextSection={() => i + 2 > sections_list.length || this.showSection(sections_list[i + 1])}
              />
              break
            case C.SPREADSHEET_SECTION:
              component = <SpreadsheetSection
                action_data={action_data}
                user={user}
                skill_id={this.props.skill_id}
                onError={this.props.setError}
                updateActionData={this.updateActionData}
                updateHeaders={this.updateHeaders}
                selected_action={action}
                toggleSection={() => this.showSection(section)}
                open={this.state.active_section === C.SPREADSHEET_SECTION}
                showNextSection={() => i + 2 > sections_list.length || this.showSection(sections_list[i + 1])}
              />
              break
            case C.RETRIEVE_OPTIONS_SECTION:
              component = <RetrieveDataSection 
                action_data={action_data}
                user={user}
                integration_data={this.props.integration_data}
                selected_action={action}
                updateActionData={this.updateActionData}
                sheet_headers={this.state.headers_list}
                headers_loading={this.state.headers_loading}
                variables={this.props.variables}
                toggleSection={() => this.showSection(section)}
                open={this.state.active_section === C.RETRIEVE_OPTIONS_SECTION}
                showNextSection={() => i + 2 > sections_list.length || this.showSection(sections_list[i + 1])}
              />
              break
            case C.CREATE_OPTIONS_SECTION:
              component = <CreateDataSection
                action_data={action_data}
                headers_loading={this.state.headers_loading}
                sheet_headers={this.state.headers_list}
                variables={this.props.variables}
                updateActionData={this.updateActionData}
                toggleSection={() => this.showSection(section)}
                open={this.state.active_section === C.CREATE_OPTIONS_SECTION}
                showNextSection={() => i + 2 > sections_list.length || this.showSection(sections_list[i + 1])}
              />
              break
            case C.UPDATE_OPTIONS_SECTION:
              component = <UpdateDataSection 
                action_data={action_data}
                headers_loading={this.state.headers_loading}
                sheet_headers={this.state.headers_list}
                variables={this.props.variables}
                updateActionData={this.updateActionData}
                toggleSection={() => this.showSection(section)}
                open={this.state.active_section === C.UPDATE_OPTIONS_SECTION}
                showNextSection={() => i + 2 > sections_list.length || this.showSection(sections_list[i + 1])}
              />
              break
            case C.DELETE_OPTIONS_SECTION:
              component = <DeleteDataSection
                action_data={action_data}
                variables={this.props.variables}
                updateActionData={this.updateActionData}
                toggleSection={() => this.showSection(section)}
                open={this.state.active_section === C.DELETE_OPTIONS_SECTION}
                showNextSection={() => i + 2 > sections_list.length || this.showSection(sections_list[i + 1])}
              />
              break
            case C.OUTPUT_SECTION:
              component = <OutputSection
                action_data={action_data}
                mapping_options={this.state.headers_list}
                loading={this.state.headers_loading}
                updateHeaders={this.updateHeaders}
                variables={this.props.variables}
                updateActionData={this.updateActionData}
                toggleSection={() => this.showSection(section)}
                open={this.state.active_section === C.OUTPUT_SECTION}
                showNextSection={() => i + 2 > sections_list.length || this.showSection(sections_list[i + 1])}
              />
              break
            case C.TESTING_SECTION:
              component = <TestSection 
                selected_integration={this.props.selected_integration}
                selected_action={action}
                integration_data={this.props.integration_data}
                confirmWarningMessage={'Testing this action will directly modify your selected spreadsheet. Would you like to continue?'}
                showConfirm={this.actionsRequiringConfirm.includes(action)}
                onError={this.props.setError}
                toggleSection={() => this.showSection(section)}
                open={this.state.active_section === C.TESTING_SECTION}
              />
              break
            default:
              component = null
          }

          return (
            <div key={i} className="d-flex flex-column">
              {component}
              {i !== sections_list.length - 1 && <hr className="my-0"/>}
            </div>
          )
        })}
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setConfirm: (confirm) => dispatch(setConfirm(confirm)),
    clearModal: () => dispatch(clearModal()),
    setError: (error) => dispatch(setError(error))
  }
}

export default connect(null, mapDispatchToProps)(GoogleSheets)


