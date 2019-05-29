import React from 'react';
import {connect} from 'react-redux';
import moment from "moment";
import {Link} from "react-router-dom";
import Select from "react-select";
import {ListGroupItem} from "reactstrap";
import axios from "axios";
import {toast} from "react-toastify";

import './SkillDetail.css';

class SkillDetail extends React.Component {

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
    axios.get(`/teams/${target}`)
      .then(res => {
        this.setState({
          boards: res.data.map(t => ({
            label: `${t.name} - ${t.team_id}`,
            value: t.team_id
          }))
        })
      })
  };

  copy(skill_id) {
    if (!(skill_id && this.state.target_board)) {
      toast.error("Fields not Complete!");
      return;
    }
    axios.post(`/version/${skill_id}/copy/team/${this.state.target_board.value}`)
      .then(() => {
        this.setState({
          target_board: '',
          target_user: ''
        });
        toast.success("Successfully copied skill");
      })
      .catch(() => toast.error('Error'));
  }

  render() {
    if (!this.props.skill)
      return <div>Loading...</div>
    return (
      <ListGroupItem>
        <div className="row skill_preview">
          <div className="col-sm-3">
            <div className="skill_preview_title">
              {this.props.skill.skill_name} <span
              className="skill_preview_subtitle">Skill #{this.props.skill.skill_id}</span>
            </div>
            <div className="team_summary_created">
              {moment(this.props.skill.skill_created).format('MMMM Do YYYY, h:mm:ss a')}
            </div>
          </div>
          <div className="col-sm-3 mb-2 skill_summary_and_description">
            <div className="mt-2 skill_summary">
              {this.props.skill.summary}
            </div>
            <div className="mt-2 skill_description">
              {this.props.skill.description}
            </div>
          </div>
          <div className="col-sm-6 mb-2">
            <div>
              <Link to={`/admin/lookup/${this.props.skill.skill_id}`}>
                View skill in skill lookup
              </Link>
            </div>
            <div>
              <div className="mb-2">
                Copy this skill to:
              </div>
              <div className="row">
                <div className="col-sm-6 target_user_inputs">
                  <input placeholder="Enter Target User ID"
                         type="text"
                         value={this.state.target_user}
                         onChange={e => this.setState({target_user: e.target.value})}
                         onKeyPress={(e) => {
                           if (e.charCode === 13) {
                             e.preventDefault()
                           }
                         }}
                         onBlur={this.onUserInput}
                         className="form-control mr-2"
                         autoComplete="off"
                  />
                </div>
                <div className="col-sm-6">
                  <Select
                    placeholder="Select Board"
                    classNamePrefix="select-box"
                    className="select-box mb-2 mr-2 mt-1"
                    value={this.state.target_board}
                    onChange={t => this.setState({target_board: t})}
                    options={this.state.boards}
                  />
                </div>
              </div>
              <div className="mb-2 row">
                <div className="col-sm-3 team_summary_button_row sd_left_align" onClick={() => {
                  this.setState({target_user: this.props.user.creator_id}, this.onUserInput);
                }}>
                  <span>Myself</span>
                </div>
                <div className="col-sm-3 team_summary_button_row sd_left_align" onClick={() => {
                  this.setState({target_user: this.props.creator.creator_id}, this.onUserInput);
                }}>
                  <span>
                    {`User: ${this.props.creator.creator_id}`}
                  </span>
                </div>
                <div className="col-sm-6 team_summary_button_row">
                  <span onClick={() => this.copy(this.props.skill.skill_id)} className="mb-2">Copy!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ListGroupItem>
    )
  }
}

const mapStateToProps = state => ({
  creator: state.admin.creator
});

export default connect(mapStateToProps)(SkillDetail);
