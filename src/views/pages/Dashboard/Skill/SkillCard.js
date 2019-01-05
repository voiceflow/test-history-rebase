import React from 'react'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'

import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'

class SkillCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dropdownOpen: false
    }

    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
  }

  onMouseEnter() {
    this.setState({
      dropdownOpen: true,
    })
  }

  onMouseLeave() {
    this.setState({
      dropdownOpen: false,
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
           onMouseEnter={() => {
             this.setState({hover: true})
           }}
           onMouseLeave={() => {
             this.setState({hover: false})
           }}
        >
        <Card className='skill-card'>
          <div className="p-1 px-2">
              <Dropdown isOpen={this.state.dropdownOpen} onMouseOver={this.onMouseEnter} onMouseLeave={this.onMouseLeave} toggle={this.onMouseEnter} direction="down" className="d-inline-block">
                <DropdownToggle tag="div" className="d-inline-block">
                  <Button size="small" color="primary" className="normal-btn">
                    <i className="far fa-ellipsis-h"></i>
                  </Button>
                </DropdownToggle>
                <DropdownMenu className="card-dropdown">
                  <DropdownItem tag="div" className="space-between" onClick={()=>{this.props.history.push('/publish/' + this.props.skill.skill_id)}}>
                    Publish <span className="button-circle text-muted"><i className="fab fa-amazon"/></span>
                  </DropdownItem>
                  <DropdownItem tag="div" onClick={this.props.copySkill}>
                    Copy Skill
                  </DropdownItem>
                  <DropdownItem tag="div" onClick={this.props.deleteSkill}>
                    Delete Skill
                  </DropdownItem>
                  <DropdownItem tag="div" onClick={()=>{this.props.history.push('/creator_logs/' + this.props.skill.skill_id)}}>
                    Logs
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
          </div>
          <CardActionArea className="card-action" onClick={() =>
            this.props.open(this.props.skill.skill_id, this.props.skill.diagram)
          }>
            { image ?
              <div
                style={{backgroundImage: `url(${image})`}}
                className='card-image'
              /> :
              <div className='no-image card-image'>
                <h1>{ name }</h1>
              </div>
            }
            <CardContent>
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
