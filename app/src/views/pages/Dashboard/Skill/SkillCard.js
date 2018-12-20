import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import axios from 'axios'

import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'

import {Link} from 'react-router-dom'; 

class SkillCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dropdownOpen: false
    }

    this.toggle = this.toggle.bind(this)
    this.copySkill = this.copySkill.bind(this)
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    })
  }

  copySkill() {
    axios.post(`/skill/${this.props.skill.skill_id}/${window.user_detail.id}/copy`)
    .then(res => {
      this.props.handleCopySkill(res.data)
    })  
    .catch(err => {
      console.log(err.response)
      this.setState({
        error: 'Error copying skill'
      })
    })
  }

  render() {
    let image = this.props.skill.image;
    let name = this.props.skill.name.match(/\b(\w)/g)
    if(name) { name = name.join('') }
    else { name = this.props.skill.name }
    name = name.substring(0,3) 

    return (
      <div className="skill-card-container"
           onMouseEnter={() => {this.setState({hover: true})}}
           onMouseLeave={() => {this.setState({hover: false})}}>
        <Card className='skill-card'>
          <CardActionArea className="card-action">
            <div className="d-flex justify-content-end">
              <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} direction="left">
                <DropdownToggle tag="div" className="btn btn-primary">
                  <i className="far fa-ellipsis-v mr-2"></i>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem tag="div" onClick={()=>{this.props.history.push('/publish/amzn/' + this.props.skill.skill_id)}}>
                    Publish <span className="button-circle"><i className="fab fa-amazon"/></span>
                  </DropdownItem>
                  <DropdownItem tag="div" onClick={this.copySkill}>
                    Copy Skill
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            { image ?
              <div style={{backgroundImage: `url(${image})`}} className='card-image' onClick={()=>this.props.open(this.props.skill.skill_id, this.props.skill.diagram)}/> :
              <div className='no-image card-image' onClick={()=>this.props.open(this.props.skill.skill_id, this.props.skill.diagram)}>
                <h1>{ name }</h1>
              </div>
            }
            <CardContent onClick={()=>this.props.open(this.props.skill.skill_id, this.props.skill.diagram)}>
              <h5>
                {this.props.skill.name}
              </h5>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
    );
  }
}

export default SkillCard;
