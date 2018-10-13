import React from 'react';
import { Modal, ModalBody, Button, Input } from 'reactstrap';
import axios from 'axios';

// import Card from '@material-ui/core/Card';
// import CardActionArea from '@material-ui/core/CardActionArea';
// import CardActions from '@material-ui/core/CardActions';
// import CardContent from '@material-ui/core/CardContent';
// import TextField from '@material-ui/core/TextField';

import SkillTemplates from './SkillTemplates'

const templates = [
  {
    name: 'Blank',
    value: 'blank',
    description: 'Start off with an empty canvas',
  },
  {
    name: 'Game',
    value: 'game',
    description: 'Adventure game with many winding paths',
    image: '/images/templates/game-controller.svg',
    soon: true
  },
  {
    name: 'Story',
    value: 'story',
    description: 'Create an interactive story with many endings',
    image: '/images/templates/open-book.svg',
    soon: true
  }
]

class ModalExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      template: 'blank'
    };

    this.handleChange = this.handleChange.bind(this);
    this.changeTemplate = template => {this.setState({
      template: template
    })}
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

// <div className="hr-label">Templates</div>
// <Card className="add-skill">
//   <CardActionArea className="w-100 p-3" onClick={this.toggle}>
//     <CardContent>
//       <h2 className="mb-0">
//         <i className="fas fa-plus-circle mr-2"/> Create New Skill
//       </h2>
//     </CardContent>
//   </CardActionArea>
// </Card>
  render() {
    return (
      <div>
        <Modal isOpen={this.props.modal} toggle={this.props.toggle} size="lg" centered onClosed={this.props.onClose}>
          <div className="modal-header justify-content-center">
            <h1 className="display-5">Create New Skill</h1>
            <button type="button" className="close close-absolute" onClick={this.props.toggle}>×</button>
          </div>
          <ModalBody className="p-5">
            <Input 
              type="text" 
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
              placeholder="Skill Name" 
              bsSize="lg" />
          <div className="hr-label">Templates</div>
          <SkillTemplates templates={templates} onUpdate={this.changeTemplate} template={this.state.template}/>
          
          <div className="text-center my-3">
            <Button 
              className="create-skill" 
              color="primary" block 
              size="lg" 
              onClick={() => this.props.createSkill(this.state.name)}>
              <i className="fas fa-plus mr-2"/> Create Skill
            </Button>
          </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default ModalExample;