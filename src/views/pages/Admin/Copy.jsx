import React, { Component } from 'react';
import Select from 'react-select';
import { Button } from 'reactstrap';
import axios from 'axios';
import { connect } from 'react-redux'

class Copy extends Component {

    constructor(props) {
        super(props);
        this.state = {
            creator: '',
            skill: null,
            target: '',
            creator_skills: []
        };
    }

    onCreatorInput() {
        if (!this.state.creator) {
            return;
        }
        axios.get('/projects?user='+this.state.creator)
        .then(res => {
            this.setState({
                creator_skills: res.data.map(skill => {return {
                    label: `${skill.name}-${skill.skill_id} ${(skill.live ? "(Live)" : "")}`,
                    value: skill.skill_id
                }})
            })
        })
        .catch( error => {
            console.log(error);
        });
    }

    copy() {
        if (!(this.state.creator && this.state.skill && this.state.target)) {
            return;
        }
        axios.post(`/version/${this.state.skill.value}/copy/team/${this.state.target}`)
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

    copyToMe() {
        if (!(this.state.creator && this.state.skill)) {
            return;
        }
        const my_team = this.props.teams.byId[this.props.teams.allIds[0]]
        if(!my_team) return alert("NO BOARDS FOUND")

        axios.post(`/version/${this.state.skill.value}/copy/team/${my_team.team_id}`)
        .then(() => {
          this.setState({
              creator: '',
              skill: null,
              target: ''
          });
          alert('Success');
        })
        .catch(err => {
          console.log(err)
          alert('Error')
        });
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
                    <input placeholder="Enter Creator ID"
                        type="text"
                        value={this.state.creator}
                        onChange={e => this.setState({creator: e.target.value})}
                        onBlur={this.onCreatorInput.bind(this)}
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
                    <input placeholder="Enter Target Board ID (Board ID NOT USER ID NOW)"
                        type="text"
                        value={this.state.target}
                        onChange={e => this.setState({target: e.target.value})}
                        onKeyPress={(e)=>{if(e.charCode===13){e.preventDefault()}}}
                        className="form-control mb-2"
                    />
                    <Button color="primary" onClick={this.copy.bind(this)} className="mb-2">Copy</Button>
                    <Button color="primary" onClick={this.copyToMe.bind(this)} className="mb-2 mx-2">Copy To My Board</Button>
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
