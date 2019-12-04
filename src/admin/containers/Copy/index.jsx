/* eslint no-restricted-globals: ["error", "isFinite"] */
import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';

import { CopyContent, CopyFields, ToField } from '@/admin/containers/Copy/styles';
import { AdminTitle } from '@/admin/styles';
import Button from '@/components/Button';
import { toast } from '@/componentsV2/Toast';

function preventDefaultOnEnter(e) {
  if (e.charCode === 13) {
    e.preventDefault();
  }
}

class Copy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creator: '',
      skill: null,
      target_board: '',
      target_user: '',
      creator_skills: [],
    };

    this.onCreatorInput = this.onCreatorInput.bind(this);
    this.onUserInput = this.onUserInput.bind(this);
  }

  onCreatorInput() {
    if (isNaN(this.state.creator)) {
      return;
    }
    axios
      .get(`/user/${this.state.creator}/projects`)
      .then((res) => {
        this.setState({
          creator_skills: res.data.map((skill) => ({
            label: `${skill.name} - ${skill.skill_id} ${skill.live ? '(Live)' : ''}`,
            value: skill.skill_id,
          })),
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  onUserInput() {
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
  }

  copy() {
    if (!(this.state.creator && this.state.skill && this.state.target_board)) {
      toast.error('Fields not Complete!');
      return;
    }
    axios
      .post(`/version/${this.state.skill.value}/copy/team/${this.state.target_board.value}`)
      .then(() => {
        this.setState({
          creator: '',
          skill: null,
          target: '',
        });
        toast.success('Successfully copied skill');
      })
      .catch(() => toast.error('Error'));
  }

  render() {
    return (
      <>
        <AdminTitle>Copy Skills</AdminTitle>
        <hr />

        <CopyContent>
          <CopyFields>
            <label>COPY</label>
            <input
              placeholder="Enter Creator ID"
              type="text"
              value={this.state.creator}
              onChange={(e) => this.setState({ creator: e.target.value })}
              onBlur={this.onCreatorInput}
              onKeyPress={preventDefaultOnEnter}
              className="form-control"
            />
            <Select
              placeholder="Select Skill"
              classNamePrefix="select-box"
              className="select-box mb-2"
              value={this.state.skill}
              onChange={(t) => this.setState({ skill: t })}
              options={this.state.creator_skills}
            />
            {this.state.skill && (
              <>
                <i className="far fa-search text-dull mr-1" />
                <Link to={`/admin/lookup/${this.state.skill.value}`}>{this.state.skill.value}</Link>
              </>
            )}
          </CopyFields>
          <CopyFields>
            <label>TO</label>
            <ToField>
              <input
                placeholder="Enter Target User ID"
                type="text"
                value={this.state.target_user}
                onChange={(e) => this.setState({ target_user: e.target.value })}
                onKeyPress={preventDefaultOnEnter}
                onBlur={this.onUserInput}
                className="form-control"
              />
              <Button
                isSecondary
                onClick={() => {
                  this.setState({ target_user: this.props.user.id }, this.onUserInput);
                }}
              >
                Myself
              </Button>
            </ToField>
            <Select
              placeholder="Select Workspace"
              classNamePrefix="select-box"
              className="select-box mb-2"
              value={this.state.target_board}
              onChange={(t) => this.setState({ target_board: t })}
              options={this.state.boards}
            />
          </CopyFields>
        </CopyContent>
        <Button isPrimary onClick={this.copy.bind(this)} className="mb-2">
          Copy!
        </Button>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.account,
  teams: state.workspace,
});

export default connect(mapStateToProps)(Copy);
