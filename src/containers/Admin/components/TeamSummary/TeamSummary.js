import React from 'react';
import {Collapse, CardBody, Card, ListGroup} from 'reactstrap';
import moment from 'moment';

import './TeamSummary.css';
import SkillDetail from "../SkillDetail/SkillDetail";
import TrialModal from "../TrialModal/TrialModal";
import Button from "components/Button";


class TeamSummary extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showSkills: false,
      showTrialModal: false
    };
  }

  toggle = () => {
    this.setState(state => ({showSkills: !state.showSkills}));
  };

  toggleTrial = () => {
    this.setState(prevState => ({
      showTrialModal: !prevState.showTrialModal
    }))
  };

  renderSkillPreviews = () => {
    return this.props.board.projects.map(skill => {
      return (
        <span key={skill.skill_id}>{skill.skill_name}, </span>
      )
    })
  };

  renderSkills = () => {
    if (this.props.board) {
      return this.props.board.projects.map(skill => {
        return <SkillDetail skill={skill} key={skill.skill_id} user={this.props.user}/>
      })
    }
  };

  render() {
    return (
      <div className="team_summary">
        <div className="row">
          <div className="team_summary_left col-sm-4">
            <h5>{this.props.board.name}</h5>
            <div className="team_summary_created">
              {moment(this.props.board.created).format('MMMM Do YYYY, h:mm:ss a')}
            </div>
            <div className="team_summary_created">
              Trial Expiry: {this.props.board.expiry ? moment(this.props.board.expiry).format("MMM Do YYYY") : 'No trial set'}
            </div>
            <Button className="mt-2" isPrimary onClick={this.toggleTrial}>
              Manage Trial
            </Button>
          </div>
          <div className="mb-2 col-sm-4">
            <div className="mt-2">
              TeamId: {this.props.board.team_id}
            </div>
            <div className="mt-2">
              Seats: {this.props.board.seats}
            </div>
            <div className="mt-2">
              Projects: {this.props.board.projects.length}
            </div>
            <div className="mt-2">
							<span className="show_skills_button" onClick={this.toggle}>
								{this.state.showSkills ? 'Hide Skills' : 'Show Skills'}
							</span>
            </div>
          </div>
          <div className="mb-2 col-sm-4 skills_list">
            <div className="skills_in_board">
              Skills in this board:
            </div>
            <div className="skills_preview">
              {this.renderSkillPreviews()}
            </div>
          </div>
        </div>

        <Collapse isOpen={this.props.expand_all || this.state.showSkills}>
          <Card>
            <CardBody>
              <ListGroup>
                {this.renderSkills()}
              </ListGroup>
              <span className="show_skills_button bottom_show_skills_button" onClick={this.toggle}>
								{this.state.showSkills ? 'Hide Skills' : 'Show Skills'}
							</span>
            </CardBody>
          </Card>
        </Collapse>

        <TrialModal
          showTrialModal={this.state.showTrialModal}
          toggleTrial={this.toggleTrial}
          team={this.props.board}
        />
      </div>
    )
  }

}

export default TeamSummary;
