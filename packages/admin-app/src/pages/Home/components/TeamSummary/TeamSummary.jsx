import './TeamSummary.css';

import { ClickableText, Collapse, LegacyButton } from '@voiceflow/ui';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, ListGroup } from 'reactstrap';

import PlanModal from '@/components/PlanModal/PlanModal';
import RoleModal from '@/components/RoleModal';

import SkillDetail from '../SkillDetail/SkillDetail';
import { TeamSummaryWrapper } from './styles';

class TeamSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSkills: false,
      showPlanModal: false,
      showRoleModal: false,
    };
  }

  toggle = () => {
    this.setState((state) => ({ showSkills: !state.showSkills }));
  };

  togglePlanModal = () => {
    this.setState((prevState) => ({
      showPlanModal: !prevState.showPlanModal,
    }));
  };

  renderSkillPreviews = () =>
    this.props.board.projects.map((skill) => (
      <>
        <Link key={skill._id} to={`/admin/lookup/${skill._id}`}>
          {skill.name}
        </Link>
        {' | '}
      </>
    ));

  renderSkills = () => {
    if (this.props.board) {
      return this.props.board.projects.map((skill) => <SkillDetail skill={skill} key={skill._id} />);
    }
  };

  render() {
    return (
      <TeamSummaryWrapper>
        <div className="row">
          <div className="team_summary_left col-sm-4">
            <h5>{this.props.board.name}</h5>

            <div className="mt-2 team_summary_created">{moment(this.props.board.created).format('MMMM Do YYYY, h:mm:ss a')}</div>

            <div className="mt-2 team_summary_created">
              <span className="bold">Plan: </span>
              {this.props.board.plan}
            </div>

            <div className="mt-2 team_summary_created">
              <span className="bold">Plan Expiry: </span>
              {this.props.board.expiry ? moment(this.props.board.expiry).format('MMM Do YYYY') : 'No expiry set'}
            </div>

            <LegacyButton className="mt-2" isPrimary onClick={this.togglePlanModal}>
              Manage Plan
            </LegacyButton>
          </div>

          <div className="mb-2 col-sm-4">
            <div className="mt-2">
              <span className="bold">Role:</span>{' '}
              <ClickableText onClick={() => this.setState({ showRoleModal: true })}>{this.props.board.role}</ClickableText>
            </div>

            <div className="mt-2">
              <span className="bold">TeamId:</span> {this.props.board.team_id}
            </div>

            <div className="mt-2">
              <span className="bold">Seats:</span> {this.props.board.seats}
            </div>

            <div className="mt-2">
              <span className="bold">Projects:</span> {this.props.board.projects.length}
            </div>

            <div className="mt-2">
              <span className="show_skills_button" onClick={this.toggle}>
                {this.state.showSkills ? 'Hide Skills' : 'Show Skills'}
              </span>
            </div>
          </div>

          <div className="mb-2 col-sm-4 skills_list">
            <div className="skills_in_board">Skills in this workspace:</div>
            <div className="skills_preview">{this.renderSkillPreviews()}</div>
          </div>
        </div>

        <Collapse isOpen={this.props.expand_all || this.state.showSkills}>
          <Card style={{ marginTop: 25 }}>
            <CardBody>
              <ListGroup>{this.renderSkills()}</ListGroup>
              <span className="show_skills_button bottom_show_skills_button" onClick={this.toggle}>
                {this.state.showSkills ? 'Hide Skills' : 'Show Skills'}
              </span>
            </CardBody>
          </Card>
        </Collapse>

        <PlanModal showPlanModal={this.state.showPlanModal} togglePlanModal={this.togglePlanModal} workspace={this.props.board} />
        <RoleModal
          isOpen={this.state.showRoleModal}
          workspaceID={this.props.board.team_id}
          creatorID={this.props.user?.id}
          activeRole={this.props.board.role}
          toggleModal={() => this.setState({ showRoleModal: false })}
          updateWorkspaceMemberRole
        />
      </TeamSummaryWrapper>
    );
  }
}

export default TeamSummary;
