import React from 'react';
import {connect} from 'react-redux';
import ChargeTeamGroup from "../ChargeTeamGroup/ChargeTeamGroup";

class ChargeList extends React.Component {

  renderTeams() {
    const {charges} = this.props;
    if (charges) {
      console.log('rendering charges: ', charges);
      return charges.map(team => {
        return (
          <div className="cl__team_wrapper" key={team.team_id}>
            <ChargeTeamGroup team={team}/>
          </div>
        )
      })
    } else {
      return null;
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
