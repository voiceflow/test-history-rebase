import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import update from 'immutability-helper';
import Select from 'react-select';

import MultipleFields from './../../components/Forms/MultipleFields';
import axios from 'axios';
import MUIButton from '@material-ui/core/Button';
import { Nav, NavItem, NavLink, Input } from 'reactstrap';

import { setError } from 'actions/modalActions'

 const clientAuthScheme = [
  {value: 'HTTP_BASIC', label: 'HTTP Basic(recommended)'},
  {value: 'REQUEST_BODY_CREDENTIALS', label: 'Credentials in request body'}
];

 class AccountLinkTemplate extends Component {

     constructor(props) {
        super(props);

         this.state = {
            accountLinkingRequest: {
              skipOnEnablement: false,
              type: "AUTH_CODE",
              authorizationUrl: "",
              domains: [],
              clientId: "",
              scopes: [],
              accessTokenUrl: "",
              clientSecret: "",
              accessTokenScheme: "HTTP_BASIC",
              defaultTokenExpirationInSeconds: 3600
            },
            saving: false,
            type: 'client',
        }

         this.save = this.save.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }


     componentDidMount() {
        axios.get(`/link_account/template/${this.props.skill_id}`)
        .then(res => {
          if (!_.isEmpty(res.data.account_linking) && !_.isNull(res.data.account_linking)) {
            this.setState({
                accountLinkingRequest: res.data.account_linking,
                loading: false
            });
            if(this.iframe){
                const iframe = this.iframe;
                const doc = iframe.contentDocument;
                doc.body.innerHTML = res.data.content;
            }
          } else {
            this.setState({
                accountLinkingRequest: {
                  skipOnEnablement: false,
                  type: "AUTH_CODE",
                  authorizationUrl: "",
                  domains: [],
                  clientId: "",
                  scopes: [],
                  accessTokenUrl: "",
                  clientSecret: "",
                  accessTokenScheme: "HTTP_BASIC",
                  defaultTokenExpirationInSeconds: 3600
                }
            });
            if(this.iframe){
                const iframe = this.iframe;
                const doc = iframe.contentDocument;
                doc.body.innerHTML = this.state.content;
            }
          }
        }).catch(err => {
            console.error(err);
            this.props.setError({message: 'Unable to Retrieve Template',})
        })
    }

     save() {
      this.setState({
          saving: true
      });
      axios.post(`/link_account/template/?skill_id=${this.props.skill_id}`, this.state.accountLinkingRequest)
      .then(()=>{
          this.setState({
              saving: false
          });
      })
      .catch(err=>{
          console.error(err);
          this.props.setError({message: 'Unable to save template'})
          this.setState({
              saving: false
          });
      });
    }

     handleChange(idx, e, type, fields){
      this.setState({
        accountLinkingRequest: update(this.state.accountLinkingRequest, {
          [type]: {[idx]: {$set: [e.target.value]}}
        })
      })
    }

     handleAdd (type) {
      if (_.isUndefined(this.state.accountLinkingRequest[type])) {
        this.setState({
          accountLinkingRequest: update(this.state.accountLinkingRequest, {
            [type]: {$set: ['']}
          }),
        })
      } else {
        this.setState({
          accountLinkingRequest: update(this.state.accountLinkingRequest, {
            [type]: {$push: ['']}
          }),
        })
      }
    }

     handleRemove(idx, type){
      this.setState({
        accountLinkingRequest: update(this.state.accountLinkingRequest, {
          [type]: {$set: _.filter(this.state.accountLinkingRequest[type], (p, pidx) => idx !== pidx)}
        }),
      })
    }

     render() {
        return (
            <div className="business-page-inner">
                <div className="content">
                    <div className="space-between">
                        <h5 className="text-muted mb-0">Account Linking Template</h5>
                        <div className="subheader-right">
                            <MUIButton varient="contained" className="purple-btn" onClick={this.save} style={{width: 100}}>
                                {this.state.saving ?
                                    <span className="loader"/> :
                                    <React.Fragment>
                                        Save
                                    </React.Fragment>
                                }
                            </MUIButton>
                        </div>
                    </div>
                    <hr/>
                    { this.state.loading ?
                        <div id="loading-diagram">
                            <div className="text-center">
                                <h5 className="text-muted mb-2">Loading Template</h5>
                                <span className="loader"/>
                            </div>
                        </div> :
                        <React.Fragment>
                          <label>
                              URL Authorization
                          </label>
                            <Input
                              name="form-control-border form-control mb-3"
                              value={this.state.accountLinkingRequest.authorizationUrl || ''}
                              placeholder="URL Authorization"
                              onChange={(e) => {
                                let accountLinkingRequest = this.state.accountLinkingRequest;
                                accountLinkingRequest.authorizationUrl = e.target.value;
                                this.setState({
                                  accountLinkingRequest: accountLinkingRequest
                                })
                              }}
                            />
                            <label>
                                Access Token URL
                            </label>
                            <Input
                              className="form-control-border form-control mb-3"
                              value={this.state.accountLinkingRequest.accessTokenUrl || ''}
                              placeholder="Access Token URL"
                              onChange={(e) => {
                                let accountLinkingRequest = this.state.accountLinkingRequest;
                                accountLinkingRequest.accessTokenUrl = e.target.value;
                                this.setState({
                                  accountLinkingRequest: accountLinkingRequest
                                })
                              }}
                            />

                           <hr/>

                           <Nav tabs className="mb-3">
                              <NavItem className="mr-2" onClick={() => this.setState({type: 'client'})}>
                                  <NavLink href="#" active={this.state.type === 'client'}>
                                      Client
                                  </NavLink>
                              </NavItem>
                              <NavItem className="mr-2" onClick={() => {this.setState({type: 'scope'})}}>
                                  <NavLink href="#" active={this.state.type === 'scope'}>Scope</NavLink>
                              </NavItem>
                              <NavItem className="mr-2" onClick={() => this.setState({type: 'domain'})}>
                                  <NavLink href="#" active={this.state.type === 'domain'}>Domain</NavLink>
                              </NavItem>
                          </Nav>
                            {
                              this.state.type === "client" &&
                              <React.Fragment>
                                <label>
                                    Client ID
                                </label>
                                <Input
                                  className="form-control-border form-control mb-3"
                                  value={this.state.accountLinkingRequest.clientId || ''}
                                  placeholder="Client ID"
                                  onChange={(e) => {
                                    let accountLinkingRequest = this.state.accountLinkingRequest;
                                    accountLinkingRequest.clientId = e.target.value;
                                    this.setState({
                                      accountLinkingRequest: accountLinkingRequest
                                    })
                                  }}
                                />
                                <label>
                                    Client Secret
                                </label>
                                <Input
                                  className="form-control-border form-control mb-3"
                                  type="password"
                                  value={this.state.accountLinkingRequest.clientSecret || ''}
                                  placeholder="Client Secret"
                                  onChange={(e) => {
                                    let accountLinkingRequest = this.state.accountLinkingRequest;
                                    accountLinkingRequest.clientSecret = e.target.value;
                                    this.setState({
                                      accountLinkingRequest: accountLinkingRequest
                                    })
                                  }}
                                />
                              </React.Fragment>
                            }
                            {
                              this.state.type === 'scope' &&
                              <MultipleFields
                                handleChange={this.handleChange}
                                handleAdd={this.handleAdd}
                                handleRemove={this.handleRemove}
                                fields={this.state.accountLinkingRequest.scopes}
                                label="Scopes"
                                type="scopes"
                              />
                            }
                            {
                              this.state.type === 'domain' &&
                              <MultipleFields
                                label="Domains"
                                type="domains"
                                handleChange={this.handleChange}
                                handleAdd={this.handleAdd}
                                handleRemove={this.handleRemove}
                                fields={this.state.accountLinkingRequest.domains}
                              />
                            }
                            <hr />

                               <label>
                                  Access Token Expiration
                              </label>
                              <Input
                                type="number"
                                className="form-control-border form-control right mb-3"
                                value={this.state.accountLinkingRequest.defaultTokenExpirationInSeconds || ''}
                                placeholder="Access Token URL"
                                onChange={(e) => {
                                  let accountLinkingRequest = this.state.accountLinkingRequest;
                                  accountLinkingRequest.defaultTokenExpirationInSeconds = e.target.value;
                                  this.setState({
                                    accountLinkingRequest: accountLinkingRequest
                                  })
                                }}
                              />
                            <label>Client Authentication Scheme</label>
                              <Select
                                  classNamePrefix="variable-box"
                                  className="map-box"
                                  onChange={(e) => {
                                    let accountLinkingRequest = this.state.accountLinkingRequest
                                    accountLinkingRequest.accessTokenScheme = e.value
                                    this.setState({
                                      accountLinkingRequest: accountLinkingRequest
                                    })
                                  }}
                                  placeholder={_.find(clientAuthScheme,{
                                    value: this.state.accountLinkingRequest.accessTokenScheme
                                  }).label}
                                  options={clientAuthScheme}
                              />
                            <br/>
                        </React.Fragment>
                    }
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
  return {
    setError: (err) => dispatch(setError(err))
  }
}
 export default connect(null, mapDispatchToProps)(AccountLinkTemplate);
