import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import {Link} from 'react-router-dom'; 

class SkillCard extends React.Component {

  render() {
    let image = this.props.skill.image;
    let name = this.props.skill.name.match(/\b(\w)/g)
    if(name) { name = name.join('') }
    else { name = this.props.skill.name }
    name = name.substring(0,3) 

    return (
      <div className="skill-card-container">
        <Card className='skill-card'>
          <CardActionArea className="card-action" onClick={()=>this.props.open(this.props.skill.skill_id, this.props.skill.diagram)}>
            { image ?
              <div style={{backgroundImage: `url(${image})`}} className='card-image'/> :
              <div className='no-image card-image' >
                <h1>{ name }</h1>
              </div>
            }
            <CardContent>
              <h5>
                {this.props.skill.name}
              </h5>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Link to={"/publish/amzn/" + this.props.skill.skill_id} className="no-underline">
              <Button size="small" color="primary" className="normal-btn">
                <i className="far fa-ellipsis-v mr-2"/> Settings
              </Button>
            </Link>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default SkillCard;
