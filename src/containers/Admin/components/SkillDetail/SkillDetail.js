import React from 'react';
import moment from "moment";
import {Link} from "react-router-dom";
import Select from "react-select";
import {ListGroupItem} from "reactstrap";
import axios from "axios";
import {toast} from "react-toastify";
import Button from "components/Button";

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
              Skill name: {this.props.skill.skill_name}
            </div>
            <div className="team_summary_created">
              {moment(this.props.skill.skill_created).format('MMMM Do YYYY, h:mm:ss a')}
            </div>
          </div>
          <div className="col-sm-3 mb-2">
            <div className="mt-2">
              Skill Id: {this.props.skill.skill_id}
            </div>
            <div className="mt-2">
              Skill summary: {this.props.skill.summary}
            </div>
            <div className="mt-2">
              Skill description: {this.props.skill.description}
            </div>
          </div>
          <div className="col-sm-6 mb-2">
            <div>
              Actions
            </div>
            <div>
              <Link to={`/admin/lookup/${this.props.skill.skill_id}`}>
                View skill in skill lookup
              </Link>
            </div>
            <div>
              Copy this skill to:
              <div>
                <div className="super-center mb-2 row">
                  <Button isSecondary className="mr-2" onClick={() => {
                    this.setState({target_user: this.props.user.creator_id}, this.onUserInput);
                  }}>Myself</Button>
                  <Button isSecondary className="mr-2 col-sm-2" onClick={() => {
                    this.setState({target_user: this.props.searched_user.creator_id}, this.onUserInput);
                  }}>{`User: ${this.props.searched_user.creator_id}`}</Button>
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
                         className="form-control mr-2 col-sm-3"
                  />
                  <Select
                    placeholder="Select Board"
                    classNamePrefix="select-box"
                    className="select-box mb-2 mr-2 mt-1 col-sm-5"
                    value={this.state.target_board}
                    onChange={t => this.setState({target_board: t})}
                    options={this.state.boards}
                  />
                </div>
                <div className="team_summary_button_row">
                  <span onClick={() => this.copy(this.props.skill.skill_id)} className="mb-2">Copy!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ListGroupItem>
    )
  }
};

export default SkillDetail;