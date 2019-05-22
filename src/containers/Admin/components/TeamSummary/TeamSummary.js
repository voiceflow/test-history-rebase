import React from 'react';
import {Collapse, CardBody, Card, ListGroup, ListGroupItem} from 'reactstrap';
import moment from 'moment';

import './TeamSummary.css';

class TeamSummary extends React.Component {

	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
		this.state = {
			showSkills: false
		};
	}

	toggle = () => {
		console.log('toggling');
		this.setState(state => ({ showSkills: !state.showSkills }));
	};

	renderSkills = () => {
		console.log('skills: ', this.props.board.projects);
		return this.props.board.projects.map(skill => {
			return (
				<ListGroupItem key={skill.skill_id}>
					<div className="row skill_preview">
						<div className="col-sm-4">
							<div className="skill_preview_title">
								Skill name: {skill.skill_name}
							</div>
							<div className="team_summary_created">
								{moment(skill.skill_created).format('MMMM Do YYYY, h:mm:ss a')}
							</div>
						</div>
						<div className="col-sm-8 team_summary_right">
							<div className="team_summary_right_info">
								Skill Id: {skill.skill_id}
							</div>
							<div className="team_summary_right_info">
								Skill summary: {skill.summary}
							</div>
							<div className="team_summary_right_info">
								Skill description: {skill.description}
							</div>
						</div>
					</div>
				</ListGroupItem>
			)
		})
	};

	render () {
		return (
			<div className="team_summary">
				<div className="row">
					<div className="team_summary_left col-sm-4">
						<h5>{this.props.board.name}</h5>
						<div id="team_summary_created">
							{moment(this.props.board.created).format('MMMM Do YYYY, h:mm:ss a')}
						</div>
					</div>
					<div className="team_summary_right col-sm-8">
						<div className="team_summary_right_info">
							TeamId: {this.props.board.team_id}
						</div>
						<div className="team_summary_right_info">
							Seats: {this.props.board.seats}
						</div>
						<div className="team_summary_right_info">
							Projects: {this.props.board.projects.length}
						</div>
						<div className="team_summary_right_info">
							<span className="show_skills_button" onClick={this.toggle}>
								{this.state.showSkills ? 'Hide Skills' : 'Show Skills'}
							</span>
						</div>
					</div>
				</div>

				<Collapse isOpen={this.state.showSkills}>
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
			</div>
		)
	}

}

export default TeamSummary;