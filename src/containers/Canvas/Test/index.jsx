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
import C from './constants';
import Timeline from './timeline';

const SECTIONS = {
  [C.CONDITIONS]: Conditions,
  [C.TIMELINE]: Timeline,
};

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      variableMapping: props.variables.reduce((key, val) => {
        key[val] = val;
        return key;
      }, {}),
      conditionsOpen: true,
    };
  }

  toggleSection = (section) => {
    if (section === C.CONDITIONS) {
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
            case C.CONDITIONS:
              section = (
                <Conditions
                  testing_info={this.props.testing_info}
                  flow={this.props.flow}
                  handleVariableChange={this.handleVariableChange}
                  variableMapping={this.state.variableMapping}
                />
              );

              break;
            case C.TIMELINE:
              section = (
                <Timeline
                  testing_info={this.props.testing_info}
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
                />
              );
              break;
            default:
              section = null;
          }

          return (
            <div key={i} className="sidebar_container">
              <div
                className="condition-label"
                onClick={() => {
                  this.toggleSection(s);
                }}
              >
                <label id={s} className="ml-3 mt-4 mb-4 text-left">
                  {s}
                </label>
                {s === C.CONDITIONS && !this.props.testing_info && (
                  <i
                    className={cn('fas fa-caret-down fa-lg', 'light-grey', 'd-flex', 'align-items-center', {
                      rotate: conditionsOpen,
                      'fa-rotate--90': !conditionsOpen,
                    })}
                  />
                )}
                {s === C.TIMELINE && (
                  <Tooltip title="Restart Test" position="bottom" distance={16} className="d-flex align-items-center">
                    <div onClick={() => this.props.resetTest()}>
                      <img src="/restart.svg" alt="restart" width="15" height="15" />
                    </div>
                  </Tooltip>
                )}
              </div>
              <Collapse isOpen={s === C.CONDITIONS ? !this.props.testing_info && this.state.conditionsOpen : true}>{section}</Collapse>
              {s === C.CONDITIONS && (
                <div
                  className={cn('no-space__break', {
                    // 'mt-3': !conditionsOpen || this.props.testing_info
                  })}
                />
              )}
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

const mapDispatchToProps = (dispatch) => {
  return {
    setError: (err) => dispatch(setError(err)),
  };
};
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Test);
