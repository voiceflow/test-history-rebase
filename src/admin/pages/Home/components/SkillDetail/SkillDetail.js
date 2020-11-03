/* eslint no-restricted-globals: ["error", "isFinite"] */
import './SkillDetail.css';

import axios from 'axios';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';

import { getPlatformService } from '@/clientV2';
import { toast } from '@/components/Toast';

export class SkillDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSkills: false,
      target_board: '',
      target_user: '',
    };
  }

  onUserInput = () => {
    const target = this.state.target_user;
    if (isNaN(target)) {
      return;
    }
    axios.get(`/teams/${target}`).then((res) => {
      this.setState({
        boards: res.data.map((t) => ({
          label: `${t.name} - ${t.team_id}`,
          value: t.team_id,
        })),
      });
    });
  };

  copy = async () => {
    if (!(this.props.skill._id && this.state.target_board)) {
      toast.error('Fields not Complete!');
      return;
    }

    const service = getPlatformService(this.props.skill.platform);

    try {
      await service.project.copy(this.props.skill._id, { teamID: this.state.target_board.value });

      this.setState({ target_user: '', target_board: '' });

      toast.success('Project copied successfully!');
    } catch {
      toast.error('Error');
    }
  };

  render() {
    if (!this.props.skill) return <div>Loading...</div>;
    return (
      <div className="row skill_preview py-4">
        <div className="col-sm-6">
          <div className="skill_preview_title">
            <div className="skill_preview_title_large mb-2">{this.props.skill.name}</div>

            <div className="skill_preview_subtitle mb-1">
              <b>Skill id:</b> {this.props.skill._id}
            </div>
            <div className="skill_preview_subtitle mb-1">
              <b>Platform:</b> {this.props.skill.platform}
            </div>
            <div className="skill_preview_subtitle mb-2">
              <b>Dev version:</b> {this.props.skill.devVersion}
            </div>
          </div>

          <div className="team_summary_created">{moment(this.props.skill.created).format('MMMM Do YYYY, h:mm:ss a')}</div>
        </div>

        <div className="col-sm-6">
          <div className="mb-1">
            <Link to={`/admin/lookup/${this.props.skill._id}`}>View skill in skill lookup</Link>
          </div>
          <div>
            <div className="mb-2">Copy this skill to:</div>
            <div className="row">
              <div className="col-sm-6 target_user_inputs">
                <input
                  placeholder="Enter Target User ID"
                  type="text"
                  value={this.state.target_user}
                  onChange={(e) => this.setState({ target_user: e.target.value })}
                  onKeyPress={(e) => {
                    if (e.charCode === 13) {
                      e.preventDefault();
                    }
                  }}
                  onBlur={this.onUserInput}
                  className="form-control mr-2"
                  autoComplete="off"
                />
              </div>
              <div className="col-sm-6">
                <Select
                  placeholder="Select Workspace"
                  classNamePrefix="select-box"
                  className="select-box mb-2 mr-2 mt-1"
                  value={this.state.target_board}
                  onChange={(t) => this.setState({ target_board: t })}
                  options={this.state.boards}
                />
              </div>
            </div>
            <div className="mb-2 row">
              <div
                className="col-sm-3 team_summary_button_row sd_left_align"
                onClick={() => {
                  this.setState({ target_user: this.props.user.id }, this.onUserInput);
                }}
              >
                <span>Myself</span>
              </div>
              <div
                className="col-sm-3 team_summary_button_row sd_left_align"
                onClick={() => {
                  this.setState({ target_user: this.props.creator.creator_id }, this.onUserInput);
                }}
              >
                <span>{`User: ${this.props.creator.creator_id}`}</span>
              </div>
              <div className="col-sm-6 team_summary_button_row">
                <span onClick={this.copy} className="mb-2">
                  Copy!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  creator: state.admin.creator,
  user: state.account,
});

export default connect(mapStateToProps)(SkillDetail);
