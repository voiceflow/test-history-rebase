import React, { Component } from 'react'
import { connect } from 'react-redux';
import { fetchTeams, updateCurrentTeam } from "actions/projectsActions";
import { setConfirm, setError } from 'actions/modalActions'

import Templates from 'views/pages/Templates'
import Dashboard from 'views/pages/Dashboard'

import { Spinner } from './views/components/Spinner'

const getTeamFromURL = (computedMatch) => {
  return computedMatch && computedMatch.params && computedMatch.params.team_id
}

class Team extends Component {

  componentDidUpdate() {
    const new_team = getTeamFromURL(this.props.computedMatch)
    if(new_team && this.props.team_id !== new_team){
      this.props.updateCurrentTeam(new_team)
    }else if(!new_team && this.props.team_id){
      this.props.history.push(`/team/${this.props.team_id}`)
    }
  }

  componentDidMount() {
    this.props.fetchTeams().then(() => {
      if(this.props.teams.length > 0){
        let urlTeam = getTeamFromURL(this.props.computedMatch)
        if(!this.props.team_id){
          this.props.updateCurrentTeam( urlTeam || this.props.teams[0].team_id)
        }
        if(!urlTeam) this.props.history.push(`/team/${this.props.team_id}`)
      }
    })
  }

  render() {
    if(!this.props.team_id) return <Spinner name="Team"/>

    switch(this.props.page) {
      case 'template':
        return <Templates {...this.props}/>
      default:
        return <Dashboard {...this.props}/>
    }
  }
}

const mapStateToProps = state => ({
  team_id: state.projects.team_id,
  teams: state.projects.teams
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