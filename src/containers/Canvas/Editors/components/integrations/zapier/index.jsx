import React from 'react'
import _ from 'lodash'
import './zapier.css'
import IntegrationBase from '../integrationBase'

import { connect } from 'react-redux'
import { setConfirm, clearModal, setError } from 'ducks/modal'
import update from 'immutability-helper'

import CreateDataSection from './actions/createDataSection'

import FeedAddUserModal from './addUserModal'

import ActionSection from '../actionSection'
import UserSection from '../userSection'
import TestSection from '../testSection'

import C from './constants'
class Zapier extends IntegrationBase {

  constructor(props) {
    super(props)

    this.state = {
      spreadsheet: null
    }

    this.integration = C.ZAPIER
    this.integration_info = {
      actions: {
        [C.CREATE_DATA]: {
          sections: [
            C.ACTIONS_SECTION,
            C.USER_SECTION,
            C.CREATE_OPTIONS_SECTION,
            C.TESTING_SECTION
          ],
          tooltip: 'Trigger a Zap'
        },
      },
      addUserModal: FeedAddUserModal
    }
    this.actionsRequiringConfirm = [
    ]
  }

  componentDidMount() {
    if (!this.props.integration_data.selected_action) {
      this.setState({
        active_section: C.ACTIONS_SECTION
      })
    }
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
    const integrationsUser = this.props.integration_data.user

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
                user_modal={FeedAddUserModal}
                action_data={action_data}
                integration_data={this.props.integration_data}
                integrationsUser={integrationsUser}
                selected_integration={this.props.selected_integration}
                toggleSection={() => this.showSection(section)}
                userChanged={this.userChanged}
                open={this.state.active_section === C.USER_SECTION}
                updateIntegrationData={this.props.updateIntegrationData}
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

const mapStateToProps = state => ({
  user: state.account
})

const mapDispatchToProps = dispatch => {
  return {
    setConfirm: (confirm) => dispatch(setConfirm(confirm)),
    clearModal: () => dispatch(clearModal()),
    setError: (error) => dispatch(setError(error))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Zapier)
