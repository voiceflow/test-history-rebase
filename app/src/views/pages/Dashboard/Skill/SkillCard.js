import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import {Link} from 'react-router-dom'; 

class SkillCard extends React.Component {

  render() {
    let image = this.props.skill.image;

    return (
      <div className="skill-card-container">
        <Card className='skill-card'>
          <CardActionArea className="card-action" onClick={()=>this.props.open(this.props.skill.skill_id, this.props.skill.diagram)}>
            <div style={{backgroundImage: `url(${image ? image : '/img/placeholder.svg'})`}} className= {(image ? '' : 'no-image ') + 'card-image'}/>
            <CardContent>
              <Typography variant="h5" component="h2">
                {this.props.skill.name}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Link to={"/publish/" + this.props.skill.skill_id}>
              <Button size="small" color="primary">
                Settings
              </Button>
            </Link>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default SkillCard;
