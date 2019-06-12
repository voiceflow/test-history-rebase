import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Toggle from 'react-toggle';
import { Alert, Button, ButtonGroup } from 'reactstrap';

const PERMISSIONS = [
  { name: 'Reminders', code: 'alexa::alerts:reminders:skill:readwrite' },
  { name: 'Notifications', code: 'alexa::devices:all:notifications:write' },
  { name: 'Address', code: 'alexa::devices:all:address:full:read' },
  { name: 'Full Name', code: 'alexa::profile:name:read' },
  { name: 'Email', code: 'alexa::profile:email:read' },
  { name: 'Phone', code: 'alexa::profile:mobile_number:read' },
];

class PermissionCard extends Component {
  constructor(props) {
    super(props);

    if (!props.node.extras.permissions) {
      props.node.extras.permissions = [];
    }

    this.state = {
      node: props.node,
    };

    this.toggle = this.toggle.bind(this);
    this.togglePermission = this.togglePermission.bind(this);
  }

  toggle(field) {
    const node = this.state.node;
    node.extras[field] = !node.extras[field];
    this.forceUpdate();
  }

  togglePermission(permission) {
    const node = this.state.node;
    const perm_set = new Set(node.extras.permissions);
    if (perm_set.has(permission)) {
      perm_set.delete(permission);
    } else {
      perm_set.add(permission);
    }
    node.extras.permissions = [...perm_set];
    this.forceUpdate();
  }

  render() {
    if (this.state.node.extras.settings) {
      return (
        <div>
          <button onClick={() => this.toggle('settings')} className="btn btn-clear exit">
            <i className="far fa-chevron-left" /> Back
          </button>
          <div className="space-between mt-3">
            <label>Custom Permissions</label>
            <Toggle checked={!!this.state.node.extras.custom} onChange={() => this.toggle('custom')} icons={false} />
          </div>
          {this.state.node.extras.custom && (
            <React.Fragment>
              <hr />
              {PERMISSIONS.map((permission) => (
                <div className="space-between" key={permission.code}>
                  <label>{permission.name}</label>
                  <Toggle
                    checked={this.state.node.extras.permissions.includes(permission.code)}
                    onChange={() => this.togglePermission(permission.code)}
                    icons={false}
                  />
                </div>
              ))}
            </React.Fragment>
          )}
        </div>
      );
    }
    return (
      <React.Fragment>
        <ButtonGroup className="toggle-group mb-2">
          <Button
            outline={this.state.node.extras.a_l}
            onClick={() => this.state.node.extras.a_l && this.toggle('a_l')}
            disabled={!this.state.node.extras.a_l}
          >
            {' '}
            Permissions{' '}
          </Button>
          <Button
            outline={!this.state.node.extras.a_l}
            onClick={() => !this.state.node.extras.a_l && this.toggle('a_l')}
            disabled={this.state.node.extras.a_l}
          >
            {' '}
            Account Linking{' '}
          </Button>
        </ButtonGroup>
        <div className={this.props.live_mode ? 'text-center disabled-overlay' : 'text-center'}>
          {this.state.node.extras.a_l ? (
            <React.Fragment>
              {this.props.account_linking ? (
                <label>
                  <b>{this.props.account_linking.authorizationUrl}</b>
                </label>
              ) : (
                <Alert color="warning" className="mt-3">
                  <i className="far fa-exclamation-triangle mr-1" /> No Account Link found
                </Alert>
              )}
              <Link className="btn btn-clear btn-block" to={`/tools/${this.props.skill_id}/link_account/templates`}>
                Edit Account Linking
              </Link>
              <hr />
              <div className="px-4">
                <label>Send an Account Linking Card to the user's phone/device</label>
              </div>
              <div className="px-5 mt-4">
                <div className="smartphone">
                  <img src="/images/account_linking.png" className="w-100" alt="sample account linking" />
                </div>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="px-4">
                <label>Send a Permission Request Card to the user's phone/device</label>
              </div>
              <div className="px-5 mt-4">
                <div className="smartphone">
                  <img src="/images/permissions.png" className="w-100" alt="sample permission" />
                </div>
              </div>
              <div className="mt-4">
                <button className="btn btn-clear" onClick={() => this.toggle('settings')}>
                  Settings
                </button>
              </div>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  skill_id: state.skills.skill.skill_id,
  account_linking: state.skills.skill.account_linking,
  live_mode: state.skills.live_mode,
});
export default connect(mapStateToProps)(PermissionCard);
