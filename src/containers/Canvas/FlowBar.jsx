import './FlowBar.css';

import cn from 'classnames';
import { renameDiagram } from 'ducks/diagram';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 } from 'uuid';

export class FlowBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name ? this.props.name : 'Flow',
      edit: false,
      newFlowName: this.props.name ? this.props.name : 'Flow',
      leftDropdownOpen: false,
      rightDropdownOpen: false,
      parentDiagrams: this.getParentDiagramsWithNames(),
      childDiagrams: this.getChildDiagramsWithNames(),
    };
  }

  static getDerivedStateFromProps(props) {
    return {
      name: props.name ? props.name : 'Flow',
    };
  }

  componentDidUpdate = (nextProps) => {
    if (nextProps.diagrams !== this.props.diagrams) {
      this.setState({
        parentDiagrams: this.getParentDiagramsWithNames(),
        childDiagrams: this.getChildDiagramsWithNames(),
      });
    }
  };

  getChildDiagramsWithNames = () => {
    if (!this.props.diagram) return;

    return this.props.diagram.sub_diagrams
      .map((diagram_id) => this.props.diagrams.filter(({ id }) => id === diagram_id))
      .filter((childDiagrams) => !_.isEmpty(childDiagrams))
      .map(([{ name, id }]) => ({ name, id }));
  };

  getParentDiagramsWithNames = () => {
    if (!this.props.diagram) return;

    return this.props.diagrams.filter(({ sub_diagrams }) => sub_diagrams.includes(this.props.diagram_id)).map(({ name, id }) => ({ name, id }));
  };

  toggle = (side) => {
    if (side === 'left')
      this.setState({
        leftDropdownOpen: !this.state.leftDropdownOpen,
      });
    else {
      this.setState({
        rightDropdownOpen: !this.state.rightDropdownOpen,
      });
    }
  };

  render() {
    if (!this.props.diagram) return null;

    return (
      <React.Fragment>
        {this.props.isCanvas && (
          <button
            id="home-button"
            className={cn('btn-home', 'pl-3', {
              closed: this.props.testing,
              isCanvas: this.props.isCanvas,
              isTest: !this.props.isCanvas,
            })}
            onClick={() => this.props.enterFlow(this.props.root_id)}
          >
            <span>Home</span>
          </button>
        )}
        <div id="flow-bar" className="text-center">
          <div className="super-center px-5 w-100 no-select">
            <div className="text-muted text-max w-100 px-5 mt-1">
              <i className="flow-icon mr-3">&nbsp;&nbsp;&nbsp;&nbsp;</i>
              {this.state.edit ? (
                <input
                  className="plain-input ml-2"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  value={this.state.newFlowName}
                  onBlur={() => {
                    this.setState({
                      edit: false,
                    });
                    this.props.renameFlow(this.props.diagram_id, this.state.newFlowName);
                  }}
                  onKeyUp={(e) => {
                    if (e.keyCode === 13) {
                      this.setState({
                        edit: false,
                      });
                      this.props.renameFlow(this.props.diagram_id, this.state.newFlowName);
                    }
                  }}
                  onChange={(e) =>
                    this.setState({
                      newFlowName: e.target.value,
                    })
                  }
                />
              ) : (
                this.state.name
              )}
            </div>
          </div>
          <Dropdown direction="up" isOpen={this.state.leftDropdownOpen} toggle={() => this.toggle('left')}>
            <DropdownToggle className="dropdown-button mt-1 previous" tag="button" disabled={this.state.parentDiagrams.length === 0}>
              <img src="/arrow-left-hover.svg" alt="arrow" className={cn('flow-arrow', { active: this.state.leftDropdownOpen })} />
            </DropdownToggle>
            <DropdownMenu className="no-select py-2 mb-2">
              {this.state.parentDiagrams &&
                this.state.parentDiagrams.map(({ id, name }) => (
                  <DropdownItem onClick={() => this.props.enterFlow(id)} className="pointer" key={v4()}>
                    {name === 'ROOT' ? 'Home' : name}
                  </DropdownItem>
                ))}
            </DropdownMenu>
          </Dropdown>
          <Dropdown direction="up" isOpen={this.state.rightDropdownOpen} toggle={() => this.toggle('right')}>
            <DropdownToggle className="dropdown-button mr-4 mt-1" tag="button" disabled={this.state.childDiagrams.length === 0}>
              <img src="/arrow-right-hover.svg" alt="arrow" className={cn('flow-arrow', { active: this.state.rightDropdownOpen })} />
            </DropdownToggle>
            <DropdownMenu className="no-select py-2 mb-2">
              {this.state.childDiagrams.map(({ id, name }) => (
                <DropdownItem onClick={() => this.props.enterFlow(id)} className="pointer" key={v4()}>
                  {name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const diagram = _.find(state.diagrams.diagrams, ['id', state.skills.skill.diagram]);

  return {
    diagrams: state.diagrams.diagrams,
    diagram,
    diagram_id: state.skills.skill.diagram,
    name: diagram && diagram.name,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    renameFlow: (id, name) => dispatch(renameDiagram(id, name)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlowBar);
