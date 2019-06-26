import './TestSidebar.css';
import './TestModal.css';

import cn from 'classnames';
import { setError } from 'ducks/modal';
import update from 'immutability-helper';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import { Collapse } from 'reactstrap';
import { compose } from 'recompose';

import Conditions from './conditions';
import { CONDITIONS, TIMELINE } from './constants';
import Timeline from './timeline';

const SECTIONS = {
  [CONDITIONS]: Conditions,
  [TIMELINE]: Timeline,
};

class Test extends Component {
  state = {
    reset: false,
    conditionsOpen: true,
    variableMapping: this.props.variables.reduce((key, val) => {
      key[val] = val;
      return key;
    }, {}),
  };

  toggleSection = (section) => {
    if (section === CONDITIONS) {
      this.setState((state) => ({
        conditionsOpen: !state.conditionsOpen,
      }));
    }
  };

  handleVariableChange = (variable, value) => {
    const newState = update(this.state, {
      variableMapping: {
        [variable]: { $set: value },
      },
    });
    this.setState(newState);
  };

  render() {
    const { conditionsOpen } = this.state;
    return (
      <div
        id="TestSidebar"
        className={cn({
          open: this.props.open,
        })}
      >
        {Object.keys(SECTIONS).map((s, i) => {
          let section;
          switch (s) {
            case CONDITIONS:
              section = (
                <Conditions
                  testing_info={this.props.testing_info}
                  flow={this.props.flow}
                  handleVariableChange={this.handleVariableChange}
                  variableMapping={this.state.variableMapping}
                />
              );

              break;
            case TIMELINE:
              section = (
                <Timeline
                  testing_info={this.props.testing_info}
                  reset={this.state.reset}
                  setReset={(r) => this.setState({ reset: r })}
                  flow={this.props.flow}
                  diagramEngine={this.props.diagramEngine}
                  time={this.props.time}
                  enterFlow={this.props.enterFlow}
                  stop={this.props.stop}
                  resume={this.props.resume}
                  history={this.props.history}
                  setTime={this.props.setTime}
                  resetTest={this.props.resetTest}
                  variableMapping={this.state.variableMapping}
                  open={this.props.open}
                />
              );
              break;
            default:
              section = null;
          }

          return (
            <div
              key={i}
              className={cn('sidebar_container', `${s === CONDITIONS ? 'variables' : 'dialog'}_container`, {
                open: this.props.open,
              })}
            >
              <div
                className="condition-label"
                onClick={() => {
                  this.toggleSection(s);
                }}
              >
                <label id={s} className="ml-3 mt-3 mb-3 text-left">
                  {s === CONDITIONS ? 'Variables' : 'Dialog'}
                </label>
                {s === CONDITIONS && !this.props.testing_info && (
                  <i
                    className={cn('fas fa-caret-down fa-lg', 'light-grey', 'd-flex', 'align-items-center', {
                      rotate: conditionsOpen,
                      'fa-rotate--90': !conditionsOpen,
                    })}
                  />
                )}
                {s === TIMELINE && (
                  <div onClick={() => this.setState({ reset: true })} className="d-flex align-items-center">
                    <Tooltip title="Restart Test" position="bottom">
                      <img src="/restart.svg" alt="restart" width="15" height="15" />
                    </Tooltip>
                  </div>
                )}
              </div>
              <Collapse isOpen={s === CONDITIONS ? !this.props.testing_info && this.state.conditionsOpen : true}>{section}</Collapse>
              {s === CONDITIONS && <div className="no-space__break" />}
            </div>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  skill: state.skills.skill,
  diagram_id: state.skills.skill.diagram,
  variables: state.variables.localVariables.concat(state.skills.skill.global),
});

const mapDispatchToProps = {
  setError,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Test);
