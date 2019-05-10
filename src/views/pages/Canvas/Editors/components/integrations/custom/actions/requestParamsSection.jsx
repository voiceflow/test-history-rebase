import React, { Component } from 'react'
import update from 'immutability-helper'
import AceEditor from 'react-ace'
import randomstring from 'randomstring'
import { Collapse, Nav, NavItem, NavLink } from "reactstrap";

import Button from 'components/Button'
import VariableInput from '../../../VariableInput'
import APIInputs from '../../../APIInputs'

import C from '../constants'
import { draftIsEmpty } from '../../util'
// props
// action_data, open, toggleSection, variables, showNextSection

const TABS = ['raw', 'formatted', 'results']

class GetRequestSection extends Component {
  constructor(props) {
    super(props)

    let tab = localStorage.getItem('api_test_tab')
    if (!tab) tab = TABS[1]

    this.state = {
      modal: false,
      activeTab: tab,
      body_state: true,
      modalContent: null,
      variables: [],
      innerVariables: {},
      testVariablesMapping: {},
      dropdownOpen: false,
      type: 'headers',
      testHeader: { 'status': null, 'time': null, 'size': null },
      popoverOpen: false,
      loading: false
    }
  }

  componentDidMount() {
    this.checkCompletion()
  }

  checkCompletion = () => {
    let completed = false
    const action_data = this.props.action_data

    completed = action_data && action_data.url && !draftIsEmpty(action_data.url)

    if (completed !== this.state.completed) {
      this.setState({
        completed: completed
      })
    }
  }

  handleAddPair = (type) => {
    this.props.updateActionData({
      [type]: update(this.props.action_data[type], {
        $push: [{
          index: randomstring.generate(10),
          val: '',
          key: ''
        }]
      })
    })
  }

  handleRemovePair = (type, i) => {
    this.props.updateActionData({
      [type]: update(this.props.action_data[type], {
        $splice: [[i, 1]]
      })
    }, this.checkCompletion)
  }

  handleKVChange = (raw, i, inputType) => {
    this.props.updateActionData({
      [this.state.type]: update(this.props.action_data[this.state.type], {
        [i]: {
          [inputType]: {
            $set: raw
          }
        }
      })
    }, this.checkCompletion)
  }

  onChangeAce = (content) => {
    this.props.updateActionData({
      content: content
    }, this.checkCompletion)
  }

  render() {

    if (!this.props.action_data) return null

    let pairContent = <APIInputs
      key={this.state.type}
      type={this.state.type}
      pairs={this.props.action_data[this.state.type]}
      variables={this.props.variables}
      onAdd={() => this.handleAddPair(this.state.type)}
      onRemove={(e, i) => this.handleRemovePair(this.state.type, i)}
      onChange={this.handleKVChange}
    />
    return (
      <>
        <div className={`d-flex flex-column section-title-container`} onClick={() => this.props.toggleSection()}>
          <div className='integrations-section-title text-muted'>With settings
          {this.state.completed && <div className="completed-badge">&nbsp;&nbsp;&nbsp;&nbsp;</div>}
          </div>
        </div>
        <Collapse isOpen={this.props.open} className='w-100'>
          <div className='d-flex align-items-center mb-4'>
            <div className='mr-2 text-muted'>URL </div>
            <VariableInput
              key={this.props.selected_action}
              className='form-control google-sheets-input'
              raw={this.props.action_data.url || null}
              variables={this.props.variables}
              updateRaw={(raw) => {
                this.props.updateActionData({
                  url: raw
                }, this.checkCompletion)
              }}
              placeholder="URL Endpoint"
            />
          </div>
          <div className="d-flex flex-column">
            <div className="align-self-center">
              <Nav tabs className="mb-3">
                <NavItem className="mr-2" onClick={() => this.setState({ type: 'headers' })}>
                  <NavLink href="#" active={this.state.type === 'headers'}>
                    Headers
                    </NavLink>
                </NavItem>
                <NavItem className="mr-2" onClick={() => { if (this.props.selected_action !== C.GET_REQUEST) this.setState({ type: 'body' }) }}>
                  <NavLink href="#" active={this.state.type === 'body'} disabled={this.props.selected_action === C.GET_REQUEST}>Body</NavLink>
                </NavItem>
                <NavItem className="mr-2" onClick={() => this.setState({ type: 'params' })}>
                  <NavLink href="#" active={this.state.type === 'params'}>Params</NavLink>
                </NavItem>
              </Nav>
            </div>

            {this.state.type === 'body' ? <React.Fragment>
              <div className="align-self-center">
                <Nav tabs className="mb-3">
                  <NavItem onClick={() => {
                    this.props.updateActionData({
                      bodyInputType: 'keyValue'
                    })
                  }}>
                    <NavLink href="#" active={this.props.action_data.bodyInputType === 'keyValue'}>
                      Key Value Input
                </NavLink>
                  </NavItem>
                  <NavItem onClick={() => {
                    this.props.updateActionData({
                      bodyInputType: 'rawInput'
                    })
                  }}>
                    <NavLink href="#" active={this.props.action_data.bodyInputType === 'rawInput'}>
                      Raw Input
                </NavLink>
                  </NavItem>
                </Nav>
              </div>
              {(this.props.action_data.bodyInputType === 'rawInput') ?
                <AceEditor
                  height='300px'
                  width='100%'
                  className="editor"
                  mode="javascript"
                  theme="chrome"
                  onChange={this.onChangeAce}
                  fontSize={14}
                  showPrintMargin={true}
                  showGutter={false}
                  highlightActiveLine={true}
                  value={this.props.action_data.content}
                  editorProps={{ $blockScrolling: true }}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: false,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 2
                  }} /> : pairContent}
            </React.Fragment> : pairContent}
            <div className="text-center my-3">
              <Button isFlat disabled={!this.state.completed} onClick={this.props.showNextSection}>
                Next
              </Button>
            </div>
          </div>
        </Collapse>
      </>
    )
  }
}

export default GetRequestSection;
