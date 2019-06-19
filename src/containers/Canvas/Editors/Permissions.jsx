import cn from 'classnames';
import Button from 'components/Button';
import { openTab } from 'ducks/user';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';

import Permission from './components/Permission';

const permission_options = [
  { name: 'User Email', value: 'alexa::profile:email:read' },
  { name: 'User Name', value: 'alexa::profile:name:read' },
  { name: 'User Phone Number', value: 'alexa::profile:mobile_number:read' },
  { name: 'Reminders', value: 'alexa::alerts:reminders:skill:readwrite' },
  { name: 'Notifications', value: 'alexa::devices:all:notifications:write' },
  { name: 'Account Linking', value: 'UNOFFICIAL::account_linking' },
  { name: 'Product', value: 'UNOFFICIAL::product' },
  { name: 'ISP', value: 'UNOFFICIAL::isp' },
  // Removed for now, amazon pay permissions broken
];

export class Permissions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      node: props.node,
      permission_options,
    };

    this.onUpdate = this.onUpdate.bind(this);
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleRemoveBlock = this.handleRemoveBlock.bind(this);
    this.handleSelectPermission = this.handleSelectPermission.bind(this);
    this.handleSelectVariableToMap = this.handleSelectVariableToMap.bind(this);
    this.handleTransactionMap = this.handleTransactionMap.bind(this);
  }

  onUpdate() {
    this.setState(
      {
        node: this.state.node,
      },
      this.props.onUpdate
    );
  }

  handleAddBlock() {
    const node = this.state.node;
    this.props.clearRedo();
    this.props.updateEvents(_.cloneDeep(node).extras);

    if (node.extras.permissions.length < this.state.permission_options.length) {
      let default_selected;

      for (let i = 0; i < this.state.permission_options.length; i++) {
        const permission = this.state.permission_options[i];
        if (!_.find(_.map(node.extras.permissions, 'selected'), { value: permission.value })) {
          default_selected = {
            label: permission.name,
            value: permission.value,
          };
          break;
        }
      }

      node.extras.permissions.push({
        selected: default_selected,
        map_to: '',
      });

      this.setState(
        {
          node,
        },
        this.props.onUpdate
      );
    }
  }

  handleRemoveBlock(i) {
    const node = this.state.node;
    this.props.clearRedo();
    this.props.updateEvents(_.cloneDeep(node).extras);

    if (node.extras.permissions.length > 0) {
      node.extras.permissions.splice(i, 1);

      this.setState(
        {
          node,
        },
        this.props.onUpdate
      );
    }
  }

  handleSelectPermission(i, selected) {
    if (selected.value !== 'Create Variable') {
      const node = this.state.node;

      if (node.extras.permissions[i].selected !== selected) {
        node.extras.permissions[i].selected = selected;

        this.setState(
          {
            node,
          },
          this.props.onUpdate
        );
      }
    } else {
      localStorage.setItem('tab', 'variables');
      this.props.openVarTab('variables');
    }
  }

  handleSelectVariableToMap(i, selected) {
    const node = this.state.node;

    if (node.extras.permissions[i].map_to !== selected) {
      node.extras.permissions[i].map_to = selected;

      this.setState(
        {
          node,
        },
        this.props.onUpdate
      );
    }
  }

  handleTransactionMap(i, selected) {
    const node = this.state.node;

    if (node.extras.permissions[i].transaction !== selected) {
      node.extras.permissions[i].transaction = selected;

      this.setState(
        {
          node,
        },
        this.props.onUpdate
      );
    }
  }

  handleSelectProductToMap(i, selected) {
    const node = this.state.node;

    if (node.extras.permissions[i].product !== selected) {
      node.extras.permissions[i].product = selected;

      this.setState(
        {
          node,
        },
        this.props.onUpdate
      );
    }
  }

  render() {
    return (
      <div className={cn({ 'disabled-overlay': this.props.live_mode })}>
        {this.state.node.extras.permissions.map((perm, i) => {
          return (
            <Permission
              key={i}
              permission={perm}
              selected={perm.selected}
              map_to={perm.map_to}
              product={perm.product}
              onRemove={() => this.handleRemoveBlock(i)}
              selectPermission={(selected) => this.handleSelectPermission(i, selected)}
              selectVariableToMap={(selected) => this.handleSelectVariableToMap(i, selected)}
              selectTransactionMap={(selected) => this.handleTransactionMap(i, selected)}
              selectProductToMap={(selected) => this.handleSelectProductToMap(i, selected)}
              permissions={this.state.permission_options}
              disabled_perms={this.state.node.extras.permissions}
              onUpdate={this.onUpdate}
              variables={this.props.variables}
            />
          );
        })}
        {this.state.node.extras.permissions.length < this.state.permission_options.length ? (
          <Button isBtn isClear isLarge isBlock onClick={this.handleAddBlock}>
            <i className="far fa-plus" /> Add Permission Request
          </Button>
        ) : null}
        <Alert className="mt-3">
          If failing, try prompting the user with the <b>Permission</b> block and a message
        </Alert>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  live_mode: state.skills.live_mode,
});

const mapDispatchToProps = (dispatch) => {
  return {
    openVarTab: (tab) => dispatch(openTab(tab)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Permissions);
