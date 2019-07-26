import cn from 'classnames';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DropdownItem, DropdownMenu, DropdownToggle, Input, UncontrolledDropdown } from 'reactstrap';

import { renameDiagram } from '@/ducks/diagram';

class FlowButton extends Component {
  constructor(props) {
    super(props);

    const { diagram } = props;

    this.state = {
      edit: false,
      name: diagram.name ? diagram.name : '',
    };

    this.close = this.close.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  close() {
    const { preview, renameFlow, flow } = this.props;
    const { name } = this.state;

    if (!preview) {
      renameFlow(flow.id, name).then(() => {
        this.setState({
          edit: false,
        });
      });
    }
  }

  render() {
    const { diagram, active: propActive, flow, enterFlow, depth, preview, copyFlow, deleteFlow } = this.props;
    const { edit, name } = this.state;

    if (!diagram) return null;

    const active = propActive === flow.id;
    return (
      <div className={cn('diagram-block', { active })}>
        <button className="diagram-button" onClick={active ? null : () => enterFlow(flow.id)} style={{ marginLeft: depth ? depth * 20 : 0 }}>
          <i className="flow-icon mr-3" />
          {edit ? (
            <Input
              name="name"
              className="diagram-text"
              value={name}
              onChange={this.handleChange}
              onKeyPress={(target) => (target.charCode === 13 ? this.close() : null)}
              onBlur={this.close}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          ) : (
            <span className="diagram-text">
              {/* eslint-disable no-nested-ternary */}
              {flow.name === 'ROOT'
                ? 'HOME'
                : _.trim(diagram.name)
                ? diagram.name.length > 15
                  ? `${diagram.name.substring(0, 15)}...`
                  : diagram.name
                : 'Flow'}
              {/* eslint-enable no-nested-ternary */}
            </span>
          )}
        </button>
        {flow.name !== 'ROOT' && !preview && !edit && (
          <UncontrolledDropdown inNavbar>
            <DropdownToggle className="diagram-edit" tag="button">
              <i className="fas fa-cog" />
            </DropdownToggle>
            <DropdownMenu right className="arrow arrow-right no-select" style={{ marginTop: -2 }}>
              <DropdownItem header>Flow Options</DropdownItem>
              <DropdownItem onClick={() => this.setState({ edit: true, name: diagram.name })} className="pointer">
                Edit Name
              </DropdownItem>
              <DropdownItem onClick={copyFlow} className="pointer">
                Copy
              </DropdownItem>
              <DropdownItem onClick={deleteFlow} className="pointer">
                Delete
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  active: state.skills.skill.diagram,
  diagram: _.find(state.diagrams.diagrams, ['id', props.flow.id]),
});

const mapDispatchToProps = (dispatch) => {
  return {
    renameFlow: (flow_id, name) => dispatch(renameDiagram(flow_id, name)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlowButton);
