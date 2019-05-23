import React, { Component } from 'react'
import ReactJson from 'react-json-view'
import _ from 'lodash'
import DefaultModal from 'components/Modals/DefaultModal'
import update from 'immutability-helper'
import { Button, Collapse, InputGroupAddon, Input, InputGroup, Alert } from 'reactstrap';

import IntegrationsService from 'services/Integrations'
import C from './constants'

import { deepDraftToMarkdown, deepVariableSubstitution } from '../../../../../intent_util'

import { connect } from 'react-redux'
import { setConfirm, setError } from 'ducks/modal'

const SERVICES_MAP = {
  [C.GS.GOOGLE_SHEETS]: {
    [C.GS.RETRIEVE_DATA]: IntegrationsService.googleSheets.retrieveData,
    [C.GS.CREATE_DATA]: IntegrationsService.googleSheets.createData,
    [C.GS.UPDATE_DATA]: IntegrationsService.googleSheets.updateData,
    [C.GS.DELETE_DATA]: IntegrationsService.googleSheets.deleteData
  },
  [C.CU.CUSTOM_API]: {
    [C.CU.GET_REQUEST]: IntegrationsService.custom.getRequest,
    [C.CU.POST_REQUEST]: IntegrationsService.custom.postRequest,
    [C.CU.PATCH_REQUEST]: IntegrationsService.custom.patchRequest,
    [C.CU.PUT_REQUEST]: IntegrationsService.custom.putRequest,
    [C.CU.DELETE_REQUEST]: IntegrationsService.custom.deleteRequest,
  },
  [C.ZP.ZAPIER]:{
    [C.ZP.CREATE_DATA]: IntegrationsService.zapier.createMessage,
  }
}

// props
// selected_integration, selected_action, integration_data, setError, open, toggleSection

class TestSection extends Component {

  constructor(props) {
    super(props)

    this.state = {
      completed: false,
      variableValues: {}
    }

    this.copyJSONPath = this.copyJSONPath.bind(this)
    this.runTest = this.runTest.bind(this)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.integration_data.selected_action !== this.props.integration_data.selected_action) {
      this.setState({
        completed: false,
        test_content: null
      })
    }
  }

  async runTest() {
    const selected_integration = this.props.selected_integration
    const { user, selected_action, actions_data } = this.props.integration_data

    if (!selected_integration) {
      this.props.setError(new Error('Test failed! Please select an integration'))
    } else if (!selected_action) {
      this.props.setError(new Error('Test failed! Please select an action'))
    } else if (!(actions_data && actions_data[selected_action])) {
      this.props.setError(new Error('Test failed! Please complete all required sections'))
    } else {
      try {
        const test = SERVICES_MAP[selected_integration] && SERVICES_MAP[selected_integration][selected_action]
        if (!test) {
          this.props.setError(new Error(`No test found for action "${selected_action}" and integration "${selected_integration}"`))
        } else {
          let params = _.cloneDeep(actions_data[selected_action])

          const { result, variables } = deepDraftToMarkdown(params)

          if (variables && variables.length > 0) {
            try {
              await new Promise((resolve, reject) => {
                this.resolveModalPromise = resolve
                this.setState({
                  variables_modal: true,
                  variables: variables,
                  variableValues: {}
                })
              })
              this.setState({
                variables_modal: false
              })
            } catch (e) {
              this.setState({
                test_loading: false,
                test_content: null
              })
              return
            }
          }
          params = deepVariableSubstitution(result, this.state.variableValues)
          params.user = user

          this.setState({
            test_content: {},
            test_loading: true
          })

          const resp = await test(params)

          let display
          if (!resp) display = {}
          else if (JSON.stringify(resp).length > 100000) {
            display = {
              message: 'Response contents are too large to display!'
            }
          }
          else if (typeof resp === 'object') display = resp
          else display = {
            message: resp
          }

          this.setState({
            test_content: display,
            test_loading: false,
            completed: true
          })
        }
      } catch (e) {
        this.props.setError(e)
        this.setState({
          test_loading: false,
          test_content: null
        })
      }
    }
  }

  copyJSONPath(copy_event) {
    let total_path = copy_event.namespace.slice()

    if (copy_event.name !== '') {
      total_path.push(copy_event.name)
    }

    // Copy to clipboard
    const el = document.createElement('textarea');
    el.value = total_path.join('.');
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  handleVariableChange = event => {
    this.setState({
      variableValues: update(this.state.variableValues, { [event.target.name]: { $set: event.target.value } })
    })
  }

  showConfirmModal = () => {
    this.setState({
      test_content: null
    })
    this.props.setConfirm({
      text: <Alert color="danger" className="mb-0">
        <i className="fas fa-exclamation-triangle fa-2x" /><br />
        {this.props.confirmWarningMessage}
      </Alert>,
      warning: true,
      confirm: () => {
        this.runTest()
      }
    })
  }

  render() {
    return (
      <>
        <DefaultModal
          open={this.state.variables_modal}
          header="Set Variables"
          toggle={() =>
            this.setState({
              variables_modal: !this.state.variables_modal,
              test_loading: false,
              test_content: null
            })
          }
          content={
            <div style={{ padding: '0 2em 2em 2em' }}>
              {!_.isEmpty(this.state.variables) &&
                <React.Fragment>
                  <Button color="primary" onClick={() => this.resolveModalPromise()} className="mt-2 mb-2"><i className="fas fa-play mr-2" /> Run</Button>
                  <br />
                  <label>Your parameters for this action contain variables. Please provide them with values to proceed.</label><br />
                  {_.map(this.state.variables, (val, key) => (
                    <React.Fragment key={key}>
                      <InputGroup className="mb-2">
                        <InputGroupAddon addonType='prepend'>{val}</InputGroupAddon>
                        <Input className='form-control form-control-border right' name={val} placeholder='set variable' onChange={this.handleVariableChange} />
                      </InputGroup>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              }
            </div>
          }
          hideFooter={true}
          noPadding={true}
        />
        <div className="d-flex flex-column section-title-container" onClick={() => this.props.toggleSection()}>
          <div className='integrations-section-title text-muted'>Test Integration
            {this.state.completed && <div className="completed-badge">&nbsp;&nbsp;&nbsp;&nbsp;</div>}
          </div>
        </div>
        <Collapse isOpen={this.props.open} className='w-100'>
          <Button className="mb-3 btn btn-lg btn-block" color="clear" onClick={() => this.props.showConfirm ? this.showConfirmModal() : this.runTest()} size="sm" block><i className="fas fa-power-off mr-2"></i>Test Integration</Button>
          {this.state.test_content && Object.keys(this.state.test_content).length === 0 && !this.state.test_loading && <div className="text-center mb-2 success">Action Performed Succesfully!<div className="small text-muted">(No Data Returned)</div></div>}
          {this.state.test_content && Object.keys(this.state.test_content).length > 0 && <div className="mb-3" ><ReactJson src={this.state.test_content} displayDataTypes={false} name='response' enableClipboard={this.copyJSONPath} collapsed={JSON.stringify(this.state.test_content).length > 1000} /></div>}
          {this.state.test_loading && <div className="text-center"><div className='loader text-lg' /></div>}
        </Collapse>
      </>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setConfirm: (confirm) => dispatch(setConfirm(confirm)),
    setError: (error) => dispatch(setError(error))
  }
}

export default connect(null, mapDispatchToProps)(TestSection)
