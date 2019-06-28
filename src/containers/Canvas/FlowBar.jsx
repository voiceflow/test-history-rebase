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
    const { name } = this.props;
    this.state = {
      name: name ? name : 'Flow',
      edit: false,
      newFlowName: name ? name : 'Flow',
      leftDropdownOpen: false,
      rightDropdownOpen: false,
      parentDiagrams: this.getParentDiagramsWithNames(),
      childDiagrams: this.getChildDiagramsWithNames(),
    };
  }

  static getDerivedStateFromProps({ name }) {
    return {
      name: name ? name : 'Flow',
    };
  }

  componentDidUpdate = (nextProps) => {
    const { diagrams } = this.props;
    if (nextProps.diagrams !== diagrams) {
      this.setState({
        parentDiagrams: this.getParentDiagramsWithNames(),
        childDiagrams: this.getChildDiagramsWithNames(),
      });
    }
  };

  getChildDiagramsWithNames = () => {
    const { diagram, diagrams } = this.props;
    if (!diagram) return;

    return diagram.sub_diagrams
      .map((diagram_id) => diagrams.filter(({ id }) => id === diagram_id))
      .filter((childDiagrams) => !_.isEmpty(childDiagrams))
      .map(([{ name, id }]) => ({ name, id }));
  };

  getParentDiagramsWithNames = () => {
    const { diagram, diagrams, diagram_id } = this.props;
    if (!diagram) return;

    return diagrams.filter(({ sub_diagrams }) => sub_diagrams.includes(diagram_id)).map(({ name, id }) => ({ name, id }));
  };

  toggle = (side) => {
    const { leftDropdownOpen, rightDropdownOpen } = this.state;
    if (side === 'left')
      this.setState({
        leftDropdownOpen: !leftDropdownOpen,
      });
    else {
      this.setState({
        rightDropdownOpen: !rightDropdownOpen,
      });
    }
  };

  render() {
    const { diagram, enterFlow, root_id, renameFlow, diagram_id } = this.props;
    const { edit, newFlowName, name, leftDropdownOpen, parentDiagrams, rightDropdownOpen, childDiagrams } = this.state;
    if (!diagram) return null;

    return (
      <React.Fragment>
        <button id="home-button" className="btn-home pl-3" onClick={() => enterFlow(root_id)}>
          <span>Home</span>
        </button>
        <div id="flow-bar" className="text-center">
          <div className="super-center px-5 w-100 no-select">
            <div className="text-muted text-max w-100 px-5 mt-1">
              <i className="flow-icon mr-3">&nbsp;&nbsp;&nbsp;&nbsp;</i>
              {edit ? (
                <input
                  className="plain-input ml-2"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  value={newFlowName}
                  onBlur={() => {
                    this.setState({
                      edit: false,
                    });
                    renameFlow(diagram_id, newFlowName);
                  }}
                  onKeyUp={(e) => {
                    if (e.keyCode === 13) {
                      this.setState({
                        edit: false,
                      });
                      renameFlow(diagram_id, newFlowName);
                    }
                  }}
                  onChange={(e) =>
                    this.setState({
                      newFlowName: e.target.value,
                    })
                  }
                />
              ) : (
                name
              )}
            </div>
          </div>
          <Dropdown direction="up" isOpen={leftDropdownOpen} toggle={() => this.toggle('left')}>
            <DropdownToggle className="dropdown-button mt-1 previous" tag="button" disabled={parentDiagrams.length === 0}>
              <img src="/arrow-left-hover.svg" alt="arrow" className={cn('flow-arrow', { active: leftDropdownOpen })} />
            </DropdownToggle>
            <DropdownMenu className="no-select py-2 mb-2">
              {parentDiagrams &&
                parentDiagrams.map(({ id, name }) => (
                  <DropdownItem onClick={() => enterFlow(id)} className="pointer" key={v4()}>
                    {name === 'ROOT' ? 'Home' : name}
                  </DropdownItem>
                ))}
            </DropdownMenu>
          </Dropdown>
          <Dropdown direction="up" isOpen={rightDropdownOpen} toggle={() => this.toggle('right')}>
            <DropdownToggle className="dropdown-button mr-4 mt-1" tag="button" disabled={childDiagrams.length === 0}>
              <img src="/arrow-right-hover.svg" alt="arrow" className={cn('flow-arrow', { active: rightDropdownOpen })} />
            </DropdownToggle>
            <DropdownMenu className="no-select py-2 mb-2">
              {childDiagrams.map(({ id, name }) => (
                <DropdownItem onClick={() => enterFlow(id)} className="pointer" key={v4()}>
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
