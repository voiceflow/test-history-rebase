import React, { Component } from 'react'
import AsyncSelect from 'react-select/lib/Async'
import Select from 'react-select'
import { Collapse } from 'reactstrap'
import IntegrationsService from 'services/Integrations'
import _ from 'lodash'
import memoize from 'memoize-one'
import { selectStyles } from 'components/VariableSelect/VariableSelect'

// props
// action_data, integrationsUser, skill_id, onError, updateActionData, updateHeaders

class SpreadsheetSection extends Component {

  constructor(props) {
    super(props)

    this.state = {}

    this.promiseOptions = this.promiseOptions.bind(this)
    this.updateSheets = this.updateSheets.bind(this)
  }

  componentDidMount() {
    this.checkCompletion(true)
  }

  componentDidUpdate() {
    this.checkCompletion()
  }

  memoizedCompletion = memoize((initial_load, action_data, spreadsheet, sheet) => {
    let completed = false
    if (action_data && spreadsheet && sheet) {
      completed = true
    }

    if (completed !== this.state.completed) {
      this.setState({
        completed: completed
      })
    }
    if (completed && !initial_load && this.props.open) this.props.showNextSection()
  })

  checkCompletion(initial_load=false) {
    const action_data = this.props.action_data
    if (!action_data) return
    this.memoizedCompletion(initial_load, action_data, action_data.spreadsheet, action_data.sheet)
  }

  promiseOptions(inputValue) {
    const integrationsUser = this.props.integrationsUser
    if (!integrationsUser) return Promise.resolve([])

    if (!inputValue) inputValue = ''
    return IntegrationsService.googleSheets.getSpreadsheets(inputValue, integrationsUser)
  }

  async updateSheets() {
    this.setState({
      sheets_list: []
    })

    const spreadsheet_id = this.props.action_data.spreadsheet && this.props.action_data.spreadsheet.value
    if (_.isNil(spreadsheet_id)) return

    this.setState({
      sheets_loading: true
    })

    try {
      const integrationsUser = this.props.integrationsUser
      const sheets = await IntegrationsService.googleSheets.getSpreadsheetSheets(spreadsheet_id, integrationsUser)
      this.setState({
        sheets_list: sheets
      })
    } catch (e) {
      this.props.onError(e)
    }
    this.setState({
      sheets_loading: false
    })
  }

  openSpreadsheetLink = () => {
    const spreadsheet_id = this.props.action_data.spreadsheet && this.props.action_data.spreadsheet.value
    const sheet_id = this.props.action_data.sheet && this.props.action_data.sheet.value
    if (_.isNil(spreadsheet_id) || _.isNil(sheet_id)) return
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheet_id}/edit#gid=${sheet_id}`
    const win = window.open(url, '_blank')
    win.focus()
  }

  render() {
    return (
      <div>
        <div className="d-flex flex-column section-title-container" onClick={() => this.props.toggleSection()}>
          <div className='integrations-section-title text-muted'>Using sheet
          <span onClick={() => this.props.toggleSection()} className={`action-selected ${this.props.action_data.sheet ? 'action-visible' : ''}`}>{this.props.action_data.sheet && this.props.action_data.sheet.label}</span>
            {this.state.completed && <div className="completed-badge">&nbsp;&nbsp;&nbsp;&nbsp;</div>}
          </div>
        </div>
        <Collapse isOpen={this.props.open} className='w-100'>
          <div className='d-flex align-items-center mb-4'>
            <div className='mr-2 text-muted'>Spreadsheet </div>
            <div className='flex-fill'>
              <AsyncSelect
                key={JSON.stringify(this.props.integrationsUser) + JSON.stringify(this.props.integrationsUser && this.props.integrationsUser.user_id)+this.props.selected_action}
                cacheOptions
                defaultOptions
                styles={selectStyles}
                classNamePrefix="google-sheets-dropdown select-box"
                loadOptions={this.promiseOptions}
                className='auth-dropdown'
                value={this.props.action_data.spreadsheet || null}
                onChange={(v) => {
                  if (!(_.isEqual(v, this.props.action_data.spreadsheet))) {
                    this.props.updateActionData({
                      spreadsheet: v,
                      sheet: null,
                      header_column: null,
                      match_value: null,
                      row_values: null,
                      row_number: null
                    }, this.props.updateHeaders)
                  } else if (this.state.completed) {
                    this.props.showNextSection()
                  }
                }}
                noOptionsMessage={({ inputValue }) => inputValue ? 'No Options' : 'Type to search'}
              />
            </div>
          </div>
          <div className='d-flex align-items-center my-4'>
            <div className='mr-2 text-muted'>Sheet </div>
            <div className='flex-fill'>
              <Select
                styles={selectStyles}
                classNamePrefix="google-sheets-dropdown select-box"
                options={this.state.sheets_list}
                className='auth-dropdown'
                value={this.props.action_data.sheet || null}
                onChange={(v) => {
                  if (!(_.isEqual(v, this.props.action_data.sheet))){
                    this.props.updateActionData({
                      sheet: v,
                      header_column: null,
                      match_value: null,
                      row_values: [],
                      row_number: null
                    }, this.props.updateHeaders)
                  } else if (this.state.completed) {
                    this.props.showNextSection()
                  }
                }}
                isLoading={this.state.sheets_loading}
                onFocus={this.updateSheets}
                isDisabled={!this.props.action_data.spreadsheet}
              />
            </div>
            <div className={`ml-3 text-muted spreadsheet-link ${this.props.action_data.spreadsheet && this.props.action_data.sheet ? '' : 'disabled'}`}  onClick={this.openSpreadsheetLink}></div>
          </div>
        </Collapse>
      </div>
    )
  }
}

export default SpreadsheetSection
