import axios from 'axios';
import update from 'immutability-helper';
import _ from 'lodash';
import React, { Component } from 'react';
import Select from 'react-select';
import { Input, Nav, NavItem, NavLink } from 'reactstrap';

import MultipleFields from '@/components/Forms/MultipleFields';
import { FullSpinner } from '@/components/Spinner';
import { setError } from '@/ducks/modal';
import { activeSkillIDSelector, updateAccountLinking } from '@/ducks/skill';
import { connect } from '@/hocs';

const clientAuthScheme = [
  { value: 'HTTP_BASIC', label: 'HTTP Basic (recommended)' },
  { value: 'REQUEST_BODY_CREDENTIALS', label: 'Credentials in request body' },
];

const EMPTY_ACCOUNT_LINKING = {
  skipOnEnablement: false,
  type: 'AUTH_CODE',
  authorizationUrl: '',
  domains: [],
  clientId: '',
  scopes: [],
  accessTokenUrl: '',
  clientSecret: '',
  accessTokenScheme: 'HTTP_BASIC',
  defaultTokenExpirationInSeconds: 3600,
};

class AccountLinkTemplate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accountLinkingRequest: EMPTY_ACCOUNT_LINKING,
      type: 'client',
      loading: true,
    };

    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillUnmount() {
    if (JSON.stringify(this.state.accountLinkingRequest) !== this.snapshot) this.save();
  }

  componentDidMount() {
    axios
      .get(`/link_account/template/${this.props.skillID}`)
      .then((res) => {
        if (!_.isEmpty(res.data.account_linking) && !_.isNull(res.data.account_linking)) {
          const account_linking = res.data.account_linking;
          this.snapshot = JSON.stringify(account_linking);
          this.setState({
            accountLinkingRequest: account_linking,
            loading: false,
          });
        } else {
          this.snapshot = JSON.stringify(EMPTY_ACCOUNT_LINKING);
          this.setState({
            accountLinkingRequest: EMPTY_ACCOUNT_LINKING,
            loading: false,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        this.props.setError({ message: 'Unable to Retrieve Account Linking Info' });
      });
  }

  save() {
    axios
      .post(`/link_account/template/${this.props.skillID}`, this.state.accountLinkingRequest)
      .then(() => {
        this.props.updateAccountLinking(this.state.accountLinkingRequest);
      })
      .catch((err) => {
        console.error(err);
        this.props.setError({ message: 'Unable to save template' });
      });
  }

  handleChange(idx, e, type) {
    this.setState({
      accountLinkingRequest: update(this.state.accountLinkingRequest, {
        [type]: { [idx]: { $set: [e.target.value] } },
      }),
    });
  }

  handleAdd(type) {
    if (_.isUndefined(this.state.accountLinkingRequest[type])) {
      this.setState({
        accountLinkingRequest: update(this.state.accountLinkingRequest, {
          [type]: { $set: [''] },
        }),
      });
    } else {
      this.setState({
        accountLinkingRequest: update(this.state.accountLinkingRequest, {
          [type]: { $push: [''] },
        }),
      });
    }
  }

  handleRemove(idx, type) {
    this.setState({
      accountLinkingRequest: update(this.state.accountLinkingRequest, {
        [type]: {
          $set: _.filter(this.state.accountLinkingRequest[type], (p, pidx) => idx !== pidx),
        },
      }),
    });
  }

  render() {
    if (this.state.loading) {
      return <div>Loading</div>;
    }

    return (
      <div className="business-page-inner">
        <div className="space-between">
          <label>Account Linking Template</label>
        </div>
        <hr />
        {this.state.loading ? (
          <FullSpinner name="Template" />
        ) : (
          <>
            <label>URL Authorization</label>
            <Input
              className="form-control-border form-control mb-3"
              value={this.state.accountLinkingRequest.authorizationUrl || ''}
              placeholder="URL Authorization"
              onChange={(e) => {
                const accountLinkingRequest = this.state.accountLinkingRequest;
                accountLinkingRequest.authorizationUrl = e.target.value;
                this.setState({
                  accountLinkingRequest,
                });
              }}
            />
            <label>Access Token URL</label>
            <Input
              className="form-control-border form-control mb-3"
              value={this.state.accountLinkingRequest.accessTokenUrl || ''}
              placeholder="Access Token URL"
              onChange={(e) => {
                const accountLinkingRequest = this.state.accountLinkingRequest;
                accountLinkingRequest.accessTokenUrl = e.target.value;
                this.setState({
                  accountLinkingRequest,
                });
              }}
            />

            <hr />

            <Nav tabs className="mb-3">
              <NavItem className="mr-2" onClick={() => this.setState({ type: 'client' })}>
                <NavLink href="#" active={this.state.type === 'client'}>
                  Client
                </NavLink>
              </NavItem>
              <NavItem
                className="mr-2"
                onClick={() => {
                  this.setState({ type: 'scope' });
                }}
              >
                <NavLink href="#" active={this.state.type === 'scope'}>
                  Scope
                </NavLink>
              </NavItem>
              <NavItem className="mr-2" onClick={() => this.setState({ type: 'domain' })}>
                <NavLink href="#" active={this.state.type === 'domain'}>
                  Domain
                </NavLink>
              </NavItem>
            </Nav>
            {this.state.type === 'client' && (
              <>
                <label>Client ID</label>
                <Input
                  className="form-control-border form-control mb-3"
                  value={this.state.accountLinkingRequest.clientId || ''}
                  placeholder="Client ID"
                  onChange={(e) => {
                    const accountLinkingRequest = this.state.accountLinkingRequest;
                    accountLinkingRequest.clientId = e.target.value;
                    this.setState({
                      accountLinkingRequest,
                    });
                  }}
                />
                <label>Client Secret</label>
                <Input
                  className="form-control-border form-control mb-3"
                  type="password"
                  value={this.state.accountLinkingRequest.clientSecret || ''}
                  placeholder="Client Secret"
                  onChange={(e) => {
                    const accountLinkingRequest = this.state.accountLinkingRequest;
                    accountLinkingRequest.clientSecret = e.target.value;
                    this.setState({
                      accountLinkingRequest,
                    });
                  }}
                  autoComplete="new-password"
                />
              </>
            )}
            {this.state.type === 'scope' && (
              <MultipleFields
                handleChange={this.handleChange}
                handleAdd={this.handleAdd}
                handleRemove={this.handleRemove}
                fields={this.state.accountLinkingRequest.scopes}
                label="Scopes"
                type="scopes"
              />
            )}
            {this.state.type === 'domain' && (
              <MultipleFields
                label="Domains"
                type="domains"
                handleChange={this.handleChange}
                handleAdd={this.handleAdd}
                handleRemove={this.handleRemove}
                fields={this.state.accountLinkingRequest.domains}
              />
            )}
            <hr />

            <label>Access Token Expiration</label>
            <Input
              type="number"
              className="form-control-border form-control right mb-3"
              value={this.state.accountLinkingRequest.defaultTokenExpirationInSeconds || ''}
              placeholder="3600"
              onChange={(e) => {
                const accountLinkingRequest = this.state.accountLinkingRequest;
                accountLinkingRequest.defaultTokenExpirationInSeconds = e.target.value;
                this.setState({
                  accountLinkingRequest,
                });
              }}
            />
            <label>Client Authentication Scheme</label>
            <Select
              classNamePrefix="select-box"
              className="map-box"
              onChange={(e) => {
                const accountLinkingRequest = this.state.accountLinkingRequest;
                accountLinkingRequest.accessTokenScheme = e.value;
                this.setState({
                  accountLinkingRequest,
                });
              }}
              placeholder={
                _.find(clientAuthScheme, {
                  value: this.state.accountLinkingRequest.accessTokenScheme,
                }).label
              }
              options={clientAuthScheme}
            />
            <br />
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = {
  skillID: activeSkillIDSelector,
};

const mapDispatchToProps = {
  setError,
  updateAccountLinking,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountLinkTemplate);
