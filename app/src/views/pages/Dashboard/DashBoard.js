import React, { Component } from 'react';
// import moment from 'moment'
// import 'react-table/react-table.css'
import { Link } from 'react-router-dom';
import Masonry from 'react-masonry-component';

import CircularProgress from '@material-ui/core/CircularProgress';
import { InputGroup, Input, Button } from 'reactstrap';
// import CardMedia from '@material-ui/core/CardMedia';

// import EnvironmentModal from './EnvironmentModal'

import './DashBoard.css';

import axios from 'axios';

import ConfirmModal from './../../components/Modals/ConfirmModal';
import SkillCard from './Skill/SkillCard';

class DashBoard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            confirm: false,
            loading: false,
            skills: null,
            modal: false
        }

        this.onLoadSkills = this.onLoadSkills.bind(this);
        this.openSkill = this.openSkill.bind(this);
    }

    openSkill(skill, diagram){
        setTimeout(() => { 
            this.props.history.push(`/storyboard/${skill}/${diagram}`);
        }, 100);
    }

    componentDidMount() {
        this.onLoadSkills();
    }

    toggleDropDown() {
        this.setState({
          dropdownOpen: !this.state.dropdownOpen
        });
    }

    toggleEnv() {
        this.setState({
            openEnv: !this.state.openEnv
        })
    }

    onLoadSkills() {
        axios.get('/skills')
        .then(res => {
            this.setState({
                skills: res.data,
                loading: false
            });
        })
        .catch( error => {
            console.log(error);
        });
    }

    dismissLoadingModal() {
        this.setState({
            loading: false
        });
    }

    onDeleteDiagram(id) {
        this.setState({
            confirm: {
                text: "Are you sure you want to delete this diagram? Diagrams can not be recovered",
                confirm: () => {
                    this.setState({
                        loading: true,
                        error: false,
                        success: false,
                        confirm: false
                    });
                    axios.delete('/diagram/'+id)
                    .then(res => {
                        this.onLoad();
                    })
                    .catch(error => {
                        this.setState({ error: "Unable to Delete" });
                    });
                }
            }
        });
    }

    toggleConfirm() {
        this.setState({
            confirm: null
        });
    }

                    //     <div className="banner mb-3">
                    //     <h1 className="display-4">Welcome {this.props.user.name}</h1>
                    // </div>

    render() {
        let skills;

        if(this.state.skills === null){
            skills = <div className="super-center w-100 text-muted mt-5">
                        <div className="text-center">
                            <CircularProgress color="secondary" size={50} />
                            <br/><br/>
                            Loading Skills
                        </div>
                     </div>
        }else if(this.state.skills.length === 0){
            skills = <div className="text-center mt-5">
                        <h1 className="display-5 text-mute">
                            <i className="far fa-frown"/> No Skills Found
                        </h1>
                        <Link to="/storyboard/new">Create New Skill</Link>
                    </div>
        }else{
            skills = <Masonry elementType='div' className="skills-container">
                {this.state.skills.map((skill, i) => 
                    <SkillCard
                        key={i}
                        skill={skill}
                        open={this.openSkill}
                    />)}
            </Masonry>
        }

        return (
            <div className='Window'>
                <div className="subheader">
                    <div className="container space-between">
                        <span className="subheader-title">Welcome <b>{this.props.user.name}</b></span>
                        <div className="subheader-right">
                            <InputGroup className="mr-2">
                                <Input placeholder="Search for Skills"/>
                            </InputGroup>
                            <Link to="/storyboard/new"><Button color="primary" onClick={this.props.newSkill}><i className="fas fa-plus"/> New Project</Button></Link>
                        </div>
                    </div>
                </div>
                <ConfirmModal confirm={this.state.confirm} toggle={this.toggleConfirm}/>
                <div className="my-5 pt-4 container">
                    <div className="hr-label"><i className="fas fa-angle-right"/> Skills</div>
                    <hr/>
                    {skills}
                </div>
            </div>
        );
    }
}

export default DashBoard;
