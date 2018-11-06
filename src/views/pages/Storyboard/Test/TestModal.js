/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, InputGroup, Input, InputGroupAddon, Form, Alert } from 'reactstrap';
import axios from 'axios';
import moment from 'moment';
import Select from 'react-select';
import './TestModal.css'
import {parse} from 'html-parse-stringify';

const default_state = () => {
  return {
    diagrams: null,
    input: "",
    line: null,
    testing: true
  }
}

class TestModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      input: "",
      inputs: [],
      audio: null,
      started: false,
      data: null,
      selected_line: null,
      nodes: [],
      story_state: default_state(),
      ended: false,
      last_diagram: ""
    }

    this.updateState = this.updateState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.inputSubmit = this.inputSubmit.bind(this);
    this.removeAudio = this.removeAudio.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.recursivePlay = this.recursivePlay.bind(this);
    this.beginning = this.beginning.bind(this);
    this.handleLineSelection = this.handleLineSelection.bind(this);
    this.startline = this.startline.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(this.props.testing_info === false && !!nextProps.testing_info){
      this.setState({
          nodes: nextProps.testing_info.nodes
      });
    }
  }

  // componentWillReceiveProps(nextProps){
  //   if(nextProps.testing_info !== this.props.testing_info){
  //     if(!this.state.story_state.story){
  //       let story_state = this.state.story_state;
  //       story_state.diagrams = [{
  //         id: nextProps.testing_info.id
  //       }]
  //       this.setState({
  //         nodes: nextProps.testing_info.nodes,
  //         story_state: story_state
  //       });
  //     }
  //   }
  // }

  removeAudio(){
    if(this.state.audio){
      let audio = this.state.audio;
      audio.onended = null;
      audio.ontimeupdate = null;
      audio.onloadedmetadata = null;
      this.state.audio.pause();
      this.state.audio.removeAttribute('src');
      this.state.audio.load();
      this.setState({
        audio: null
      })
    }
  }

  componentWillUnmount() {
    this.removeAudio();
  }

  handleEnd(){
    // keep the story id the same though
    this.setState({
      ended: true
    })
  }

 handleRestart(){
    // keep the story id the same though
    this.setState({
      started: false,
      inputs: [],
      ended: false,
      story_state: default_state()
    })
  }

  // Super Janky recusive function to play audio
  recursivePlay(index, urls, ended){
    if(index >= urls.length ) {
      this.setState({
        audio: null
      });
      if(ended){
        this.handleEnd();
      }
      return;
    };

    let b = urls[index];

    if(b.type === 'tag' && b.name === 'audio' && b.attrs && b.attrs.src){
      let audio = new Audio(b.attrs.src);

      this.setState({
        audio: audio
      });

      audio.onended = () => {
        this.recursivePlay(index + 1, urls, ended);
        audio.ontimeupdate = null;
        audio.onended = null;
        audio.onloadedmetadata = null;
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      }
      audio.onloadedmetadata = () => {
        let inputs = this.state.inputs;
        let index = inputs.push({
          src: audio.src.split('/').pop().split('-').pop(),
          currentTime: 0,
          duration: audio.duration,
          time: moment().format('h:mm:ss A')
        });
        this.setState({inputs: inputs});
        audio.ontimeupdate = () => {
          let inputs = this.state.inputs;
          inputs[index - 1].currentTime = audio.currentTime;
          this.setState({inputs: inputs});
        }
      }
      audio.play();
    }else if(b.type==='text' && b.content){
      let inputs = this.state.inputs;
      inputs.push({
        text: b.content,
        time: moment().format('h:mm:ss A')
      });
      this.setState({inputs: inputs}, () => {
        this.recursivePlay(index + 1, urls, ended);
      });
    }else{
      this.handleEnd();
    }
  }

  updateState(start=false){
    let data = this.state.story_state;

    if(start){
      data.testing = {
        line: this.state.story_state.line ? this.state.story_state.line : "START",
      };
      data.diagrams = [{id: this.props.testing_info.id}]
    }

    let local = false;
    let url = local ? "http://localhost:4000/state/test" : "https://testing.getstoryflow.com/state/test"

    axios.post(url, data)
    .then(res => {
      res = res.data;

      if(res.line && !res.ending) {
        this.setState({
          story_state: res
        });
      }
      if(res.output && res.output.length > 0){
        // TYLER'S SUPER JANKY AUDIO THING

        if (res.diagrams.length > 0) {
          const current_diagram = res.diagrams[res.diagrams.length-1]['id'];
          this.setState({
            last_diagram: current_diagram
          })
        }
        const vars = res.diagram_states[this.state.last_diagram];
        console.log(vars.variables);
        let dom = parse('<speak>' + res.output + '</speak>');

        if(dom && dom.length > 0 && dom[0].type === 'tag' && 
          dom[0].name === 'speak' && dom[0].children){
          this.removeAudio();
          this.recursivePlay(0, dom[0].children, res.ending);
        }else{
          this.handleEnd();
        }
        
      }else if(res.ending){
        this.handleEnd();
      }
    })
    .catch(err => {
      this.setState({
        error: err
      });
    });
  }

  handleChange (evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  inputSubmit(e){
    e.preventDefault();

    if(this.state.input === 'SKIP LINE'){
      if(this.state.audio !== null){
        this.state.audio.onended()
      }
      this.setState({
        input: ""
      });
    }else{
      let story_state = this.state.story_state;
      story_state.input = this.state.input;
      let inputs = this.state.inputs;

      inputs.push({
        self: this.state.input,
        time: moment().format('h:mm:ss A')
      });

      this.setState({
        input: "", 
        inputs: inputs,
        story_state: story_state
      }, this.updateState);
    }

    return false;
  }

  onKeyDown(event){
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (event.key === 'Enter') {
      this.inputSubmit(event);
    }
  }

  handleLineSelection(selectedOption){
    this.setState({
      selected_line: selectedOption 
    });
  }

  startline(){
    if(!this.state.selected_line) return;
    let story_state = this.state.story_state;
    story_state.line = this.state.selected_line.value
    this.setState({
      started: true,
      story_state: story_state
    }, () => {this.updateState(true)});
  }

  beginning(){
    this.setState({
      started: true
    });
    this.updateState(true);
  }

  render() {
    return (
      <Modal isOpen={this.props.open}>
        <ModalBody className="text-center env-modal">
          <h5>Test Your Project</h5>
          <hr className="mb-0"/>
          { this.props.testing_info !== false ? 
            <div>
              { this.state.started ? 
                <React.Fragment>
                  { this.state.ended ? <Alert onClick={this.handleRestart} color="warning">This Diagram has Ended - Click to Reset</Alert> : null }
                  <div className="chatbox">
                    <div className="chats">
                      {this.state.inputs.map((chat, i) => {
                        if(chat.self){
                          return <div className="mt-2 text-right" key={i}>
                            <div className="self-message message border rounded p-2 align-self-start">
                              <p className="mb-0 px-1 text-left">{chat.self}<br/><small className="text-primary">{chat.time}</small></p>
                            </div>
                          </div>
                        }else if(chat.text){
                          return <div className="mt-2 text-left" key={i}>
                            <div className="message border rounded p-2 align-self-start">
                              <p className="mb-0 px-1 text-left">{chat.text}<br/><small className="text-primary">{chat.time}</small></p>
                            </div>
                          </div>
                        }else{
                          return <div className="mt-2 text-left" key={i}>
                            <div className="message border rounded align-self-start">
                              <div className="message-container p-2">
                                <p className="mb-0 px-1 text-left"><span className="text-muted"><i className="fas fa-volume-up"></i></span> {chat.src}<br/><small className="text-primary">{chat.time}</small></p>
                              </div>
                              <div className="message-progress" style={{width: ((chat.currentTime/chat.duration) * 100)+"%"}}>
                              </div>
                            </div>
                          </div>
                        }
                      })}
                    </div>
                  </div>
                  <Form onSubmit={this.inputSubmit}>
                    <InputGroup>
                      <Input name="input" type="text" placeholder="response" value={this.state.input} onChange={this.handleChange} onKeyDown={this.onKeyDown}/>
                      <InputGroupAddon addonType="append"><Button color="primary" type="submit"><i className="fas fa-bullhorn"></i></Button></InputGroupAddon>
                    </InputGroup>
                  </Form>
                </React.Fragment> :
                <div className="pt-3">
                  <h5><b>Start Project from the very Beginning</b></h5>
                  <Button color="primary" onClick={this.beginning} size="lg" block><i className="fas fa-play"></i>&nbsp;&nbsp;&nbsp; Start From Beginning</Button>
                  <hr/>
                  <h5><b>Start From a Specific Point in the Project</b></h5>
                  <Select
                    className="text-left mb-2" 
                    value={this.state.selected_line}
                    onChange={this.handleLineSelection}
                    options={this.state.nodes} />
                  <Button color="primary" onClick={this.startline} size="lg" block><i className="fas fa-fast-forward"></i>&nbsp;&nbsp;&nbsp; Start From Block</Button>
                </div>
              }
            </div> : <div className="p-5"><h1><i className="fas fa-sync-alt fa-spin"></i></h1></div>
          }
        </ModalBody>
        <ModalFooter className="justify-content-center">
          <Button color="danger" onClick={this.props.toggle}>Exit</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default TestModal;