import React from 'react';
import {Card, CardBody, Collapse, ListGroup} from "reactstrap";

import './ChargeTeamGroup.css';

class ChargeTeamGroup extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      collapse: false
    }
  }

  toggle() {
    this.setState(state => ({collapse: !state.collapse}));
  }

  render() {
    if (this.props.team) {
      const {team} = this.props;
      return (
        <div className="ctg__wrapper">
          <div className="ctg__team-header">
            <span>
              {this.state.collapse ? <i className="fal fa-caret-right"/> : <i className="fal fa-caret-down"/>}
            </span>
            Team #{team.team_id}
          </div>
          <Collapse isOpen={this.state.collapse}>
            <Card>
              <CardBody>

              </CardBody>
            </Card>
          </Collapse>
        </div>
      )
    } else {
      return null;
    }
  }

}

export default ChargeTeamGroup;
