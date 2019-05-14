import React, { Component } from 'react'
import cn from 'classnames'
import { Collapse } from 'reactstrap'
import { Tooltip } from 'react-tippy'
import update from 'immutability-helper';


// props
// integration_data, selected_action, all_actions, toggleSection, open, updateIntegrationData, showNextSection

class ActionSection extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.checkCompletion()
  }

  selectAction(action) {
    const integration_data = this.props.integration_data

    if (!integration_data.actions_data) {
      this.props.updateIntegrationData(update(this.props.integration_data, {
        actions_data: {
          $set: {
            [action] : this.props.initialActionData ? this.props.initialActionData(action) : {}
          }
        },
        selected_action: {
          $set: action
        }
      }))
    }
    else if (!integration_data.actions_data[action]) {
      this.props.updateIntegrationData(update(this.props.integration_data, {
        actions_data: {
          [action]: {
            $set: this.props.initialActionData ? this.props.initialActionData(action) : {}
          }
        },
        selected_action: {
          $set: action
        }
      }))
    } else {
      this.props.updateIntegrationData(update(this.props.integration_data, {
        selected_action: {
          $set: action
        }
      }))
    }

    this.setState({
      completed: true
    })
    this.props.showNextSection()
  }

  checkCompletion() {
    let completed = !!this.props.selected_action
    this.setState({
      completed: completed
    })
  }

  render() {
    const action = this.props.selected_action

    return (
      <>
        <div className="d-flex flex-column section-title-container" onClick={() => this.props.toggleSection()}>
          <div className='integrations-section-title text-muted'>I want to
            <span
              onClick={() => this.props.toggleSection()}
              className={cn('action-selected', {
                'action-visible': action
              })}>
                {action}
              </span>
            {this.state.completed && <div className="completed-badge">&nbsp;&nbsp;&nbsp;&nbsp;</div>}
          </div>
        </div>
        <Collapse isOpen={this.props.open} className='w-100'>
          <div className='d-flex align-items-center flex-column w-100 actions-section'>
            {Object.keys(this.props.all_actions).map((e, i) => {
              return <div
                key={i}
                className={cn('btn', 'btn-clear', 'btn-lg', 'btn-block', {
                  active: action === e
                })}
                onClick={() => this.selectAction(e)} style={{ position: 'relative' }}
              >
                <Tooltip
                  className="menu-tip actions-tooltip"
                  title={this.props.all_actions[e].tooltip}
                  position="bottom"
                  theme="block"
                >
                  ?
              </Tooltip>
                {e}
              </div>
            })}
          </div>
        </Collapse>
      </>
    )
  }
}

export default ActionSection
