import React from 'react';
import { Modal, ModalBody, Button, Input } from 'reactstrap';
import LOCALE_MAP from './../../../../services/LocaleMap'
const _ = require('lodash');

// import Card from '@material-ui/core/Card';
// import CardActionArea from '@material-ui/core/CardActionArea';
// import CardActions from '@material-ui/core/CardActions';
// import CardContent from '@material-ui/core/CardContent';
// import TextField from '@material-ui/core/TextField';

// import SkillTemplates from './SkillTemplates'

// const templates = [
//   {
//     name: 'Blank',
//     value: 'blank',
//     description: 'Start off with an empty canvas',
//   },
//   {
//     name: 'Game',
//     value: 'game',
//     description: 'Adventure game with many winding paths',
//     image: '/images/templates/game-controller.svg',
//     soon: true
//   },
//   {
//     name: 'Story',
//     value: 'story',
//     description: 'Create an interactive story with many endings',
//     image: '/images/templates/open-book.svg',
//     soon: true
//   }
// ]

class SkillModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      template: 'blank',
      curr_state: 'name',
      locales: ['en-US']
    };

    this.handleChange = this.handleChange.bind(this);
    this.changeTemplate = template => {this.setState({
      template: template
    })}
    this.handleTemplateChoice = this.handleTemplateChoice.bind(this);
    this.onLocaleBtnClick = this.onLocaleBtnClick.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleTemplateChoice(user_template){
    this.props.onTemplateChoice(user_template);
  }

  onLocaleBtnClick(locale) {
    let locales = this.state.locales;
    if (locales.includes(locale)) {
        if (locales.length > 1) {
            _.remove(locales, (v) => { return v === locale})
        }
    } else {
        locales.push(locale)
    }
    this.setState({
        saved: false,
        locales : locales
    })
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
    var content;
    if(this.props.user_templates.length > 0){
      content = 
      <div className="SkillModal-Templates p-2">
      {this.props.user_templates.map((user_template, i) => {
        return (
          <div className="TemplateItem" key={i} onClick={() => {this.handleTemplateChoice(user_template)}}>
            <img src={user_template.module_icon} className="TemplateIcon mr-2" alt="Template Icon"/>
            {user_template.title}
          </div>
        )
      })}
      </div>
    }else{
      content = <div><p>You have no templates <span role="img" aria-label="Crying Emoji">😭</span>, visit <Button color="link" className="pl-0 pr-0 pt-0 pb-0" onClick={() => {this.props.history.push('/market')}}>Marketplace</Button> to get some!</p></div>
    }

    return (
        <Modal isOpen={(this.props.status > 1)} centered onClosed={this.props.onClose}>
          <div className="modal-header justify-content-center">
            <h1 className="modal-bg-txt">Create New Skill</h1>
            <button type="button" className="close close-absolute" onClick={this.props.cancel}>×</button>
          </div>
          <ModalBody className="p-4">
            {this.state.curr_state === 'name'?
              <React.Fragment>
                <Input
                  type="text" 
                  name="name"
                  value={this.state.name}
                  onChange={this.handleChange}
                  placeholder="Skill Name" 
                  bsSize="lg"
                  ref={c => (this._input = c)}
                />
                <div className="text-muted mt-4">Skill Languages</div>
                <div className="grid-col-3 mx--1">
                  {LOCALE_MAP.map((locale, i) => {
                    const active = this.state.locales.includes(locale.value) ? "active" : "";
                    return <Button outline color="primary" className={`m-1 ${active}`} key={i} onClick={() => { this.onLocaleBtnClick(locale.value)}}>{locale.name}</Button>
                  })}
                </div>
                <div className="text-center my-3">
                  <Button 
                    className="create-skill" 
                    color="primary" block 
                    size="lg" 
                    onClick={() => this.props.createSkill(this.state.name, this.state.locales)}>
                    <i className="fas fa-plus mr-2"/> Create Skill
                  </Button>
                  {/*<Button 
                    className="create-skill" 
                    color="primary" block 
                    size="lg" 
                    onClick={() => {this.setState({curr_state: 'template'})}}>
                    <i className="fas fa-th-large"/> Start with Template
                  </Button>*/}
                </div>
              </React.Fragment>
              :
              <React.Fragment>
                {content}
                <div className="text-center my-3">
                  <Button 
                    className="create-skill" 
                    color="primary" block 
                    size="lg" 
                    onClick={() => {this.setState({curr_state: 'name'})}}>
                    Back
                  </Button>
                </div>
              </React.Fragment>
            }
          </ModalBody>
        </Modal>
    );
  }
}

export default SkillModal;
