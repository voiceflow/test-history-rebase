import React, { Component } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Button from "components/Button";

class Copy extends Component {

    constructor(props) {
        super(props);
        this.state = {
            creator: '',
            skill: null,
            target_board: '',
            target_user: '',
            creator_skills: []
        };

        this.onCreatorInput = this.onCreatorInput.bind(this)
        this.onUserInput = this.onUserInput.bind(this)
    }

    onCreatorInput() {
      if (isNaN(this.state.creator)) {
          return;
      }
      axios.get(`/user/${this.state.creator}/projects`)
      .then(res => {
          this.setState({
              creator_skills: res.data.map(skill => ({
                  label: `${skill.name} - ${skill.skill_id} ${(skill.live ? "(Live)" : "")}`,
                  value: skill.skill_id
              }))
          })
      })
      .catch( error => {
          console.log(error);
      });
    }

    onUserInput() {
      const target = this.state.target_user
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
    }

    copy() {
        if (!(this.state.creator && this.state.skill && this.state.target_board)) {
          alert("Fields Not Complete")
          return;
        }
        axios.post(`/version/${this.state.skill.value}/copy/team/${this.state.target_board.value}`)
        .then(() => {
          this.setState({
              creator: '',
              skill: null,
              target: ''
          });
          alert('Success');
        })
        .catch(() => alert('Error'));
    }

    render() {
        return (
            <div className="admin-page-inner">
                <div className="subheader">
                    <div className="space-between">
                        <span className="subheader-title">
                            <b>Copy</b>
                            <div className="hr-label">
                                <small><i className="far fa-user mr-1"></i></small>{' '} 
                                {this.props.user.name}{' '}
                                <small><i className="far fa-chevron-right"/></small>{' '} 
                                <span className="text-secondary">Copy</span>
                            </div>
                        </span>
                    </div>
                </div>
                <div className="content">
                    <label>COPY</label>
                    <input placeholder="Enter Creator ID"
                        type="text"
                        value={this.state.creator}
                        onChange={e => this.setState({creator: e.target.value})}
                        onBlur={this.onCreatorInput}
                        onKeyPress={(e)=>{if(e.charCode===13){e.preventDefault()}}}
                        className="form-control mb-2"
                    />
                    <Select
                        placeholder="Select Skill"
                        classNamePrefix="select-box"
                        className="select-box mb-2"
                        value={this.state.skill}
                        onChange={t => this.setState({skill: t})}
                        options={this.state.creator_skills}
                    />
                    {this.state.skill && <>
                      <i className="far fa-search text-dull mr-1"/>
                      <Link to={`/admin/version/${this.state.skill.value}`}>{this.state.skill.value}</Link>
                    </>}
                    <hr/>
                    <label>TO</label>
                    <div className="super-center mb-2">
                      <Button isSecondary className="mr-3" onClick={()=>{
                        this.setState({target_user: this.props.user.creator_id}, this.onUserInput);
                      }}>Myself</Button>
                      <input placeholder="Enter Target User ID"
                          type="text"
                          value={this.state.target_user}
                          onChange={e => this.setState({target_user: e.target.value})}
                          onKeyPress={(e)=>{if(e.charCode===13){e.preventDefault()}}}
                          onBlur={this.onUserInput}
                          className="form-control"
                      />
                    </div>
                    <Select
                        placeholder="Select Board"
                        classNamePrefix="select-box"
                        className="select-box mb-2"
                        value={this.state.target_board}
                        onChange={t => this.setState({target_board: t})}
                        options={this.state.boards}
                    />
                    <hr/>
                    <Button isPrimary onClick={this.copy.bind(this)} className="mb-2">Copy!</Button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
  user: state.account,
  teams: state.team
})

export default connect(mapStateToProps)(Copy)
