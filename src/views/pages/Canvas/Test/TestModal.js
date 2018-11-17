/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Table, Button, Modal, ModalBody, ModalHeader, ModalFooter, InputGroup, Input, InputGroupAddon, Form, Alert, ListGroup, ListGroupItem } from 'reactstrap';
import axios from 'axios';
import moment from 'moment';
import Select from 'react-select';
import './TestModal.css'
import {parse} from 'html-parse-stringify';
import Switch from '@material-ui/core/Switch';
// const _ = require('lodash');

var test_endpoint;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // dev code
    test_endpoint = 'http://localhost:4000/state/test';
} else {
    // production code
    test_endpoint = 'https://app.getvoiceflow.com/state/test';
}

const valid_tags = new Set(['voice', 'prosody', 'break', 's', 'w', 'sub', 'say-as', 'phoneme', 'p', 'lang', 'emphasis', 'amazon:effect', 'text']);

const default_state = () => {
  return {
    diagrams: null,
    input: "",
    line: null,
    testing: true
  }
}

const recurse = (tag, index=0) => {
    if(tag.type === 'text'){
      return tag.content;
    }else{
      if(!valid_tags.has(tag.name)){ return null }

      if(tag.children && tag.children.length > 0){
        let return_string = [];
        tag.children.forEach((t, i) => {
          return_string.push(recurse(t, i));
        });

        if(tag.name === 's'){
          return return_string;
        }else if(tag.name === 'voice'){
          return <React.Fragment key={index}><span className="text-muted">{tag.attrs.name}:</span>
            <br/> 
            {return_string}
          </React.Fragment>
        }else{
          return <span key={index} className="tag-wrap"><span className="tag-span">{tag.name}</span> {return_string}</span>
        }  
      }else{
        return <span key={index} className="tag-wrap tag-span">({tag.name})</span>
      }
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
      last_diagram: "",
      debug: false
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
    this.getVariables = this.getVariables.bind(this);
    this.parseBlock = this.parseBlock.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(this.props.testing_info === false && !!nextProps.testing_info){
      this.setState({
          nodes: nextProps.testing_info.nodes
      });
    }
  }

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
      // AUDIO TAGS
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
    }else if(b.type==='tag' && b.name === 'debug'){
      this.addDebugBlock(b);
      this.recursivePlay(index + 1, urls, ended);
    }else{
      this.parseBlock(b);
      this.recursivePlay(index + 1, urls, ended);
    }
  }

  parseBlock(block) {
      // TEXT TYPE
      let text = recurse(block);
      if(text){
        let inputs = this.state.inputs;
        inputs.push({
          text: text,
          time: moment().format('h:mm:ss A')
        });
        this.forceUpdate();
      }
  }

  addDebugBlock(block) {
      let inputs = this.state.inputs;

      let text = block.children && block.children[0] && block.children[0].content ? block.children[0].content : '';
      
      inputs.push({
        debug: block.attrs.type,
        text: text,
        time: moment().format('h:mm:ss A')
      });

      this.setState({inputs: inputs});
  }

  updateState(start=false){
    let data = this.state.story_state;

    if(start){
      data.testing = {
        line: this.state.story_state.line ? this.state.story_state.line : "START",
      };
      data.diagrams = [{id: this.props.testing_info.id}]
    }

    axios.post(test_endpoint, data)
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
        // console.log(res.output);
        let dom = parse('<speak>' + res.output + '</speak>');

        if(dom && dom.length > 0 && dom[0].type === 'tag' && 
          dom[0].name === 'speak' && dom[0].children){
          this.removeAudio();
          this.recursivePlay(0, dom[0].children, res.ending);
        }else{
          this.handleEnd();
        }

        // if (dom) {
        //   dom.forEach((element) => {
        //     if(element.type === 'tag' && 
        //       element.name === 'speak' && element.children){
        //       this.removeAudio();
        //       this.recursivePlay(0, element.children, res.ending);
        //     }else if (element.type === 'tag' && element.name === 'debug') {
        //       this.addDebugBlock(element.children)
        //     } else {
        //       this.handleEnd();
        //     }
        //   })
        // }
        
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

  getVariables(){
    let state = this.state.story_state;
    let diagram_id = this.state.last_diagram;
    if(state){
      if(!state.diagram_states || !state.diagram_states[diagram_id]){
        return null;
      }
      let variables = state.diagram_states[diagram_id].variables;
      let v_array = [];
      for (var key in variables) {
          if (variables.hasOwnProperty(key)) {
              v_array.push({
                name: key,
                value: variables[key]
              })
          }
      }
      return (<Table className="var-table">
        <tbody>
          {v_array.map(v => <tr key={v.name}>
            <td className="v"><span>{`{${v.name}}`}</span></td>
            <td>{v.value}</td>
          </tr>)}
        </tbody>
      </Table>)
    }
  }

  render() {

    let flow;
    if(this.state.last_diagram){
      let find = this.props.diagrams.find(d => d.id === this.state.last_diagram)
      if(find){
        flow = find.name;
      }
    }

    return (
      <Modal isOpen={this.props.open} size='lg'>
        <ModalHeader toggle={this.props.toggle}>Project Testing</ModalHeader>
        <ModalBody className="text-center env-modal test-modal">
          { this.props.testing_info !== false ? 
            <React.Fragment>
              <div className="row">
                <div className="col-sm-8 p-0">
                  { this.state.started ? 
                    <React.Fragment>
                      <div className="chatbox px-3">
                        <div className="chats">
                          {this.state.inputs.map((chat, i) => {
                            if(chat.self){
                              return <div className="mt-2 text-right" key={i}>
                                <div className="self-message message border rounded p-2 align-self-start">
                                  <p className="mb-0 px-1 text-left">{chat.self}<br/><small className="text-primary">{chat.time}</small></p>
                                </div>
                              </div>
                            }else if(chat.debug){
                              if (!this.state.debug) {
                                return null
                              }
                              return <div className="mt-2 text-left" key={i}>
                                <div className="message border rounded p-2 align-self-start debug">
                                  <div className="mb-0 px-1 text-left">
                                    <small>{chat.debug}</small>
                                    <p>
                                      {chat.text}
                                    </p>
                                  </div>
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
                      <Form onSubmit={this.inputSubmit} className="px-3 mb-3">
                        <InputGroup>
                          <Input name="input" type="text" placeholder="response" value={this.state.input} onChange={this.handleChange} onKeyDown={this.onKeyDown}/>
                          <InputGroupAddon addonType="append"><Button color="primary" type="submit"><i className="fas fa-bullhorn"></i></Button></InputGroupAddon>
                        </InputGroup>
                      </Form>
                    </React.Fragment> :
                    <div className="p-3">
                      <h6><b>Start Project from the very Beginning</b></h6>
                      <Button color="primary" onClick={this.beginning} size="lg" block><i className="fas fa-play"></i>&nbsp;&nbsp;&nbsp; Start From Beginning</Button>
                      <hr/>
                      <h6><b>Start From a Specific Point in the Project</b></h6>
                      <Select
                        classNamePrefix="select-box"
                        className="text-left mb-2" 
                        value={this.state.selected_line}
                        onChange={this.handleLineSelection}
                        options={this.state.nodes} />
                      <Button color="primary" onClick={this.startline} size="lg" block><i className="fas fa-fast-forward"></i>&nbsp;&nbsp;&nbsp; Start From Block</Button>
                    </div>
                  }
                </div>
                <div className="col-sm-4 text-left test-sidebar">
                  { this.state.ended ? <Alert onClick={this.handleRestart} color="warning" className="mb-3">Flow Ended - Reset <i className="far fa-sync-alt"/></Alert> : null }
                  <h4>{this.state.started && this.state.debug ? 'Variable State' : 'Test Tool'}</h4>
                  <div className="debug-switch">
                      Debug Mode <i className="fas fa-bug"></i>
                      <Switch
                        checked={this.state.debug}
                        onChange={() => this.setState({debug: !this.state.debug})}
                        value={this.state.debug}
                      />
                  </div>
                  { this.state.started && this.state.debug ?
                    <React.Fragment>
                      <small className="py-2">Current Flow: <b>{flow}</b></small>
                      <div className="sidebar-scroll">
                        {this.getVariables()}
                      </div>
                    </React.Fragment>:
                    <div className="sidebar-scroll">
                      <ListGroup flush>
                        <ListGroupItem tag="p">This Test Tool simulates voice apps in the browser</ListGroupItem>
                        <ListGroupItem tag="p">You don't have to wait for the speech to complete before typing or saying your next response</ListGroupItem>
                        <ListGroupItem tag="p">SSML tags are not displayed but will work in production on Google/Alexa</ListGroupItem>
                        <ListGroupItem tag="p">Debug Mode shows you block by block paths/variables</ListGroupItem>
                      </ListGroup>
                    </div>
                  }
                </div>
              </div>
            </React.Fragment> : <div className="p-5"><h1><i className="fas fa-sync-alt fa-spin"></i></h1></div>
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