import React, { Component } from 'react';
import { Alert, Button } from 'reactstrap';

class LinkAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map_token: props.map_token,
    };
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <label>Accounts</label>
          <div>
            {this.props.skill.account_linking ? (
              <React.Fragment>
                Current authorization is <b>{this.props.skill.account_linking.authorizationUrl}</b>
              </React.Fragment>
            ) : (
              <Alert color="warning">No Account Link found</Alert>
            )}
          </div>
          <Button color="clear" onClick={() => this.props.history.push(`/tools/${this.props.skill.skill_id}/link_account/templates`)} block>
            Edit Account Linking
          </Button>
          <hr />
          <Alert>
            After Account is Successfully Linked, global variable <b>{'{access_token}'}</b> will be initialized from <i>undefined</i>
          </Alert>
        </div>
      </React.Fragment>
    );
  }
}

export default LinkAccount;
