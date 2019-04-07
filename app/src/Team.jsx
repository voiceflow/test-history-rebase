import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import { fetchTeams, updateCurrentTeam, teamInvite } from "ducks/team";
import { setConfirm, setError } from 'ducks/modal'

import Templates from 'views/pages/Templates'
import Dashboard from 'views/pages/Dashboard'

import { Spinner } from './views/components/Spinner'
import { Link } from 'react-router-dom'

import queryString from 'query-string'

const getTeamFromURL = (computedMatch) => {
  return computedMatch && computedMatch.params && computedMatch.params.team_id
}

class Team extends PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      loading: true
    }
  }

  async initialize() {
    if(this.props.location.search){
      let query = queryString.parse(this.props.location.search)
      if(query.invite) {
        await this.props.teamInvite(query.invite)
      }
    }

    this.props.fetchTeams().then(() => {
      this.setState({loading: false})
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

  componentDidMount() {
    this.initialize()
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
    if(this.state.loading) return <Spinner name="Team"/>

    if(this.props.teams.allIds.length === 0) {
      return <div className="h-100 d-flex justify-content-center">
        <div className="align-self-center text-center">
          {/* <div className="pl-4">
            <img
              src="/create.svg"
              alt="skill-icon"
              width="130"
              height="127"
              className="mb-3"
            />
          </div>
          <br /> */}
          <label>Create a Workspace</label>
          <span className="text-muted">
            Create a shared workspace where your<br/> 
            team can collaboratively design and build<br/>
            incredible voice experiences
          </span><br/>
          <Link to={`/team/new`} className="no-underline">
            <button className="purple-btn mt-3">
              New Workspace
            </button>
          </Link>
        </div>
      </div>
    }

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
    setConfirm: confirm => dispatch(setConfirm(confirm)),
    setError: err => dispatch(setError(err)),
    teamInvite: invite => dispatch(teamInvite(invite))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Team)