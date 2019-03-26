import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import { fetchTeams, updateCurrentTeam } from "ducks/team";
import { setConfirm, setError } from 'ducks/modal'

import Templates from 'views/pages/Templates'
import Dashboard from 'views/pages/Dashboard'

import { Spinner } from './views/components/Spinner'

const getTeamFromURL = (computedMatch) => {
  return computedMatch && computedMatch.params && computedMatch.params.team_id
}

class Team extends PureComponent {

  constructor(props) {
    super(props)

    props.fetchTeams().then(() => {
      if(this.props.teams.allIds.length > 0){
        let urlTeam = getTeamFromURL(this.props.computedMatch)
        if(!this.props.team_id){
          this.props.updateCurrentTeam( urlTeam || this.props.teams.allIds[0])
        }else{
          this.props.updateCurrentTeam( this.props.team_id )
        }
        if(!urlTeam) this.props.history.push(`/team/${this.props.team_id}`)
      }
    })
  }

  componentDidUpdate(prevProps) {
    const new_team = getTeamFromURL(this.props.computedMatch)
    // If redux store updated and url doesn't match
    if (prevProps.team_id !== this.props.team_id && this.props.team_id !== new_team) {
      this.props.history.push(`/team/${this.props.team_id}`)
    // If url updated and redux store doesn't match
    } else if (new_team && this.props.team_id !== new_team) {
      this.props.updateCurrentTeam(new_team)
    // If redux store updated and it went into no team
    } else if (prevProps.team_id && !this.props.team_id) {
      this.props.history.push(`/dashboard`)
    }
  }

  render() {
    if(!this.props.team || this.props.teams.loading) return <Spinner name="Team"/>

    switch(this.props.page) {
      case 'template':
        return <Templates {...this.props}/>
      default:
        return <Dashboard {...this.props}/>
    }
  }
}

const mapStateToProps = state => ({
  team_id: state.team.team_id,
  team: state.team.byId[state.team.team_id],
  teams: state.team
});

const mapDispatchToProps = dispatch => {
  return {
    fetchTeams: () => dispatch(fetchTeams()),
    updateCurrentTeam: team_id => dispatch(updateCurrentTeam(team_id)),
    setConfirm: (confirm) => dispatch(setConfirm(confirm)),
    setError: (err) => dispatch(setError(err))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Team)