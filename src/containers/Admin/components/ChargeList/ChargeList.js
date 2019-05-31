import React from 'react';
import {connect} from 'react-redux';
import ChargeTeamGroup from "../ChargeTeamGroup/ChargeTeamGroup";

import "./ChargeList.css";

class ChargeList extends React.Component {

  renderTeams() {
    const {charges} = this.props;
    console.log('charges: ', charges);
    if (charges.length > 0) {
      return charges.map(team => {
        return (
          <div className="cl__team_wrapper" key={team.team_id}>
            <ChargeTeamGroup team={team}/>
          </div>
        )
      })
    } else {
      return (
        <div className="cl__no_charges">
          <p>Search for charges in the search bar above.</p> 
          <p>If you have already searched, please wait patiently as the developer of this page was
          too lazy to detect when loading happens.</p>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="cl__wrapper">
        {this.renderTeams()}
      </div>
    )
  }

}

const mapStateToProps = state => ({
  charges: state.admin.charges
});

export default connect(mapStateToProps)(ChargeList);
