import React, { Component } from 'react';
import { Button } from 'reactstrap';
import Select from 'react-select';

class LinkAccount extends Component {
    constructor(props) {
      super(props)
      this.state = {
        map_token: props.map_token
      }
    }

    selectVariableToMap(selected) {
      this.setState({
        map_token: selected
      }, () => this.props.setAccessTokenVariable(selected));
    }
    render() {
        return (
            <React.Fragment>
              <div>
                  <label>Accounts</label>
                  <div>{this.props.skill.account_linking?
                    `Current authorization is ${this.props.skill.account_linking.authorizationUrl}`:
                    `No Account Link found`
                  }</div>
                  <Button
                    color="clear"
                    onClick={() => this.props.history.push(`/business/${this.props.skill.skill_id}/link_account/templates`)}
                    size="sm" block
                  >
                  Edit Account Linking
                  </Button>
                  <hr />
                  <label>Map Access Token To</label>
                  {this.props.skill.account_linking &&
                    <Select
                      classNamePrefix="variable-box"
                      className="map-box"
                      value={this.state.map_token}
                      onChange={this.selectVariableToMap.bind(this)}
                      placeholder={this.props.variables.length > 0 ? "Variable" : "No Variables Exist [!]"}
                      options={Array.isArray(this.props.variables) ? this.props.variables.map(variable => {
                          return {label: '{' + variable + '}', value: variable}
                      }) : null}
                  />
                }
              </div>
            </React.Fragment>
        );
    }
}

export default LinkAccount;
