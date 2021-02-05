/* eslint no-restricted-globals: ["error", "isFinite"] */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { Label } from 'reactstrap';

import { Admin } from '@/admin/client';
import { CopyContent, CopyFields, ToField } from '@/admin/pages/Copy/styles';
import * as Account from '@/admin/store/ducks/accountV2';
import { AdminTitle } from '@/admin/styles';
import client from '@/client';
import Button from '@/components/LegacyButton';
import { toast } from '@/components/Toast';
import { connect } from '@/hocs';

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

    Admin.getCreatorByID(this.state.creator)
      .then((res) => {
        this.setState({
          creator_skills: Object.values(res.boards)
            .map(({ projects }) =>
              projects.map((project) => ({
                label: `${project.name} - ${project._id} ${project.version?.platformData?.status?.stage === 'LIVE' ? '(Live)' : ''}`,
                value: project._id,
                platform: project.platform,
              }))
            )
            .flat(),
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async onUserInput() {
    const target = this.state.target_user;
    if (isNaN(target)) {
      return;
    }

    try {
      const teams = await Admin.getUserTeams(target);

      this.setState({
        boards: teams.map((t) => ({
          label: `${t.name} - ${t.team_id}`,
          value: t.team_id,
        })),
      });
    } catch (err) {
      console.error(err);
    }
  }

  copy = async () => {
    if (!(this.state.creator && this.state.skill && this.state.target_board)) {
      toast.error('Fields not Complete!');
      return;
    }

    try {
      await client.platform(this.state.skill.platform).project.copy(this.state.skill.value, { teamID: this.state.target_board.value });

      this.setState({ creator: '', skill: null, target_board: '', target_user: '' });

      toast.success('Project copied successfully!');
    } catch (err) {
      toast.error('Error');
    }
  };

  render() {
    return (
      <>
        <AdminTitle>Copy Project</AdminTitle>
        <hr />

        <CopyContent>
          <CopyFields>
            <Label>COPY</Label>
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
            <Label>TO</Label>
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

const mapStateToProps = {
  user: Account.accountSelector,
};

export default connect(mapStateToProps)(Copy);
