
import React from 'react'
import _ from 'lodash'
import IntegrationBase from '../integrationBase'

import { connect } from 'react-redux'
import { setConfirm, clearModal, setError } from 'ducks/modal'
import update from 'immutability-helper'

import RequestParamsSection from './actions/requestParamsSection'
import PathOutputSection from '../pathOutputSection'
import ActionSection from '../actionSection'
import TestSection from '../testSection'

import C from './constants'

class Custom extends IntegrationBase {

  constructor(props) {
    super(props)

    this.state = {}

    this.integration = C.CUSTOM_API
    this.integration_info = {
      actions: {
        [C.GET_REQUEST]: {
          sections: [
            C.ACTIONS_SECTION,
            C.REQUEST_PARAMS_SECTION,
            C.OUTPUT_SECTION,
            C.TESTING_SECTION
          ],
          tooltip: 'Make a GET Request to an external API'
        },
        [C.POST_REQUEST]: {
          sections: [
            C.ACTIONS_SECTION,
            C.REQUEST_PARAMS_SECTION,
            C.OUTPUT_SECTION,
            C.TESTING_SECTION
          ],
          tooltip: 'Make a POST Request to an external API'
        },
        [C.PUT_REQUEST]: {
          sections: [
            C.ACTIONS_SECTION,
            C.REQUEST_PARAMS_SECTION,
            C.OUTPUT_SECTION,
            C.TESTING_SECTION
          ],
          tooltip: 'Make a PUT Request to an external API'
        },
        [C.DELETE_REQUEST]: {
          sections: [
            C.ACTIONS_SECTION,
            C.REQUEST_PARAMS_SECTION,
            C.OUTPUT_SECTION,
            C.TESTING_SECTION
          ],
          tooltip: 'Make a DELETE Request to an external API'
        },
        [C.PATCH_REQUEST]: {
          sections: [
            C.ACTIONS_SECTION,
            C.REQUEST_PARAMS_SECTION,
            C.OUTPUT_SECTION,
            C.TESTING_SECTION
          ],
          tooltip: 'Make a PATCH Request to an external API'
        }
      }
    }
    this.method_map = {
      [C.GET_REQUEST]: 'GET',
      [C.POST_REQUEST]: 'POST',
      [C.PUT_REQUEST]: 'PUT',
      [C.DELETE_REQUEST]: 'DELETE',
      [C.PATCH_REQUEST]: 'PATCH'

    }
  }

  componentDidMount() {
    if (!this.props.integration_data.selected_action) {
      this.setState({
        active_section: C.ACTIONS_SECTION
      })
    }
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

  render() {
    const action = this.props.integration_data.selected_action
    const sections_list = action ? this.integration_info.actions[action].sections : [C.ACTIONS_SECTION, C.REQUEST_PARAMS_SECTION]

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
                initialActionData={(selectedAction) => ({
                  headers: [],
                  body: [],
                  params: [],
                  mapping: [],
                  method: this.method_map[selectedAction]
                })}
                toggleSection={() => this.showSection(section)}
                open={this.state.active_section === C.ACTIONS_SECTION}
                updateIntegrationData={this.props.updateIntegrationData}
                showNextSection={() => i + 2 > sections_list.length || this.showSection(sections_list[i + 1])}
              />
              break
            case C.REQUEST_PARAMS_SECTION:
              component = <RequestParamsSection
                action_data={action_data}
                user={user}
                integration_data={this.props.integration_data}
                selected_action={action}
                updateActionData={this.updateActionData}
                sheet_headers={this.state.headers_list}
                headers_loading={this.state.headers_loading}
                variables={this.props.variables}
                toggleSection={() => this.showSection(section)}
                open={this.state.active_section === C.REQUEST_PARAMS_SECTION}
                showNextSection={() => i + 2 > sections_list.length || this.showSection(sections_list[i + 1])}
              />
              break
            case C.OUTPUT_SECTION:
              component = <PathOutputSection
                action_data={action_data}
                sheet_headers={this.state.headers_list}
                headers_loading={this.state.headers_loading}
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
              {i !== sections_list.length - 1 && <hr className="my-0" />}
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

export default connect(null, mapDispatchToProps)(Custom)
