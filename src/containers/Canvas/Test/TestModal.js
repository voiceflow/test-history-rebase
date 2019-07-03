import './TestModal.css';

import axios from 'axios';
// Components
import DefaultButton from 'components/Button';
import { ModalHeader } from 'components/Modals/ModalHeader';
import { parse } from 'html-parse-stringify';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import Toggle from 'react-toggle';
import { Alert, Button, Form, Input, InputGroup, InputGroupAddon, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, Table } from 'reactstrap';

let test_endpoint;
if (process.env.REACT_APP_BUILD_ENV === 'staging') {
  test_endpoint = 'https://staging.voiceflow.app/state/test';
} else if (process.env.NODE_ENV === 'development') {
  // dev code
  test_endpoint = 'https://localhost:4000/state/test';
} else {
  // production code
  test_endpoint = 'https://voiceflow.app/state/test';
}

const valid_tags = new Set(['voice', 'prosody', 'break', 's', 'w', 'sub', 'say-as', 'phoneme', 'p', 'lang', 'emphasis', 'amazon:effect', 'text']);

const recurse = (tag, index = 0) => {
  if (tag.type === 'text') {
    if (!tag.content.trim()) {
      return null;
    }
    return tag.content;
  }
  if (!valid_tags.has(tag.name)) {
    return null;
  }

  if (tag.children && tag.children.length > 0) {
    const return_string = [];
    tag.children.forEach((t, i) => {
      return_string.push(recurse(t, i));
    });

    if (tag.name === 's') {
      return return_string;
    }
    if (tag.name === 'voice') {
      return (
        <React.Fragment key={index}>
          <span className="text-muted">{tag.attrs.name}:</span>
          <br />
          {return_string}
        </React.Fragment>
      );
    }
    return (
      <span key={index} className="tag-wrap">
        <span className="tag-span">{tag.name}</span> {return_string}
      </span>
    );
  }
  return (
    <span key={index} className="tag-wrap tag-span">
      ({tag.name})
    </span>
  );
};

const renderVariable = (v) => (
  <tr key={v.name}>
    <td className="v">
      <span>{`{${v.name}}`}</span>
    </td>
    <td>{`{${v.value}}`}</td>
  </tr>
);

class TestModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      input: '',
      inputs: [],
      audio: null,
      started: false,
      data: null,
      selected_line: null,
      nodes: [],
      ended: false,
      debug: false,
      audioplayer: false,
    };

    this.story_state = null;
    this.pause = false;
    this.next = false;
    this.updateState = this.updateState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.inputSubmit = this.inputSubmit.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.recursivePlay = this.recursivePlay.bind(this);
    this.beginning = this.beginning.bind(this);
    this.handleLineSelection = this.handleLineSelection.bind(this);
    this.startline = this.startline.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
    this.getVariables = this.getVariables.bind(this);
    this.parseBlock = this.parseBlock.bind(this);
    this.removeAudio = this.removeAudio.bind(this);
    this.current_diagram = null;
  }

  removeAudio() {
    const { audio: stateAudio } = this.state;
    return new Promise((resolve) => {
      if (stateAudio) {
        const audio = stateAudio;
        audio.onended = null;
        audio.ontimeupdate = null;
        audio.onloadedmetadata = null;
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
        this.setState(
          {
            audio: null,
          },
          resolve
        );
      } else {
        resolve();
      }
    });
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    const { testing_info } = this.props;
    if (testing_info === false && !!nextProps.testing_info) {
      this.setState({
        nodes: nextProps.testing_info.nodes,
      });
    }
  }

  initializeStory() {
    const { repeat, platform, global } = this.props;
    this.story_state = {
      diagrams: null,
      input: '',
      line: null,
      testing: true,
      skill_id: 'TEST_SKILL',
      globals: [{}],
      repeat: repeat || 100,
      platform,
    };

    // Inject New Globals in if updated
    if (Array.isArray(global)) {
      global.forEach((variable) => {
        this.story_state.globals[0][variable] = 0;
      });
    }

    // stick in global variables
    this.story_state.globals[0].sessions = 1;
    this.story_state.globals[0].user_id = 'TEST_USER';
    this.story_state.globals[0].platform = platform;
  }

  componentWillUnmount() {
    this.removeAudio();
  }

  handleEnd() {
    // keep the story id the same though
    this.setState({
      ended: true,
    });
  }

  handleRestart() {
    // keep the story id the same though
    this.setState({
      started: false,
      inputs: [],
      ended: false,
    });

    this.story_state = null;
  }

  // Super Janky recusive function to play audio
  recursivePlay(index, urls, ended) {
    const { inputs: stateInputs } = this.state;
    // End of Audio
    if (index >= urls.length) {
      if (!this.pause) {
        this.setState(
          {
            audio: null,
          },
          () => {
            if (this.story_state.play && ['START', 'RESUME'].includes(this.story_state.play.action)) {
              this.next = true;
              this.updateState();
            }
          }
        );
      }
      if (ended) {
        this.handleEnd();
      }
      return;
    }

    const b = urls[index];

    if (b.type === 'tag' && b.name === 'audio' && b.attrs && b.attrs.src) {
      // AUDIO TAGS
      const audio = new Audio(b.attrs.src);

      this.setState({
        audio,
      });

      audio.onerror = () => {
        const inputs = stateInputs;
        inputs.push({
          text: (
            <span className="alert alert-warning mb-1 d-inline-block">
              Unable to Play Audio File on Test Tool
              <br />
              <b>{b.attrs.src}</b>
              {b.attrs.src.startsWith('soundbank') && (
                <React.Fragment>
                  <br />
                  (Soundbank Files will work on Alexa)
                </React.Fragment>
              )}
            </span>
          ),
          time: moment().format('h:mm:ss A'),
        });
        this.setState({
          inputs,
        });
        this.recursivePlay(index + 1, urls, ended);
      };

      audio.onended = () => {
        this.recursivePlay(index + 1, urls, ended);
        audio.ontimeupdate = null;
        audio.onended = null;
        audio.onloadedmetadata = null;
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      };
      audio.onloadedmetadata = () => {
        const inputs = stateInputs;
        const index = inputs.push({
          src: audio.src
            .split('/')
            .pop()
            .split('-')
            .pop(),
          currentTime: 0,
          duration: audio.duration,
          time: moment().format('h:mm:ss A'),
        });
        this.setState({ inputs });
        audio.ontimeupdate = () => {
          const inputs = stateInputs;
          inputs[index - 1].currentTime = audio.currentTime;
          this.setState({ inputs });
        };
      };

      audio.play();
    } else if (b.type === 'tag' && b.name === 'debug') {
      this.addDebugBlock(b);
      this.recursivePlay(index + 1, urls, ended);
    } else {
      this.parseBlock(b);
      this.recursivePlay(index + 1, urls, ended);
    }
  }

  parseBlock(block) {
    const { inputs: stateInputs } = this.state;
    // TEXT TYPE
    const text = recurse(block);
    if (text) {
      const inputs = stateInputs;
      inputs.push({
        text,
        time: moment().format('h:mm:ss A'),
      });
      this.forceUpdate();
    }
  }

  addDebugBlock(block) {
    const { inputs } = this.state;

    const text = block.children && block.children[0] && block.children[0].content ? block.children[0].content : '';

    inputs.push({
      debug: block.attrs.type,
      text,
      time: moment().format('h:mm:ss A'),
    });

    this.setState({ inputs });
  }

  async updateState(start = false) {
    const { slots, testing_info } = this.props;
    const { audio } = this.state;

    const data = this.story_state;

    if (!data.slots) {
      data.slots = slots;
    }

    const nlc = testing_info.nlc;

    if (nlc) {
      try {
        const results = await nlc.handleCommand(data.input);
        const detected_intents = [];

        for (let i = 0; i < results.length; i++) {
          const result = results[i];

          const intent_name = result.name;
          const detected_slots = result.slots;
          const slot_mapping = testing_info.slot_mappings[intent_name] ? testing_info.slot_mappings[intent_name] : [];

          const formatted_slots = {};
          slot_mapping.forEach((slot, i) => {
            if (detected_slots[i]) {
              formatted_slots[slot.name] = {
                value: detected_slots[i],
              };
            }
          });
          if (intent_name) {
            detected_intents.push({
              intent: intent_name,
              slots: formatted_slots,
            });
          }
        }
        data.detected_intents = detected_intents;
      } catch (err) {
        // NLC No Match
      }
    }

    if (start) {
      data.testing = {
        line: this.story_state.line_id ? this.story_state.line_id : 'START',
      };
      data.diagrams = [{ id: testing_info.id }];
    }

    if (this.next) {
      if (this.story_state.play.loop) {
        await this.removeAudio();
        this.next = false;
        return this.recursivePlay(
          0,
          [
            {
              name: 'audio',
              type: 'tag',
              attrs: {
                src: this.story_state.play.url,
              },
            },
          ],
          false
        );
      }
      data.play.action = 'NEXT';
    }

    axios
      .post(test_endpoint, data, { withCredentials: false })
      .then(async ({ data: res }) => {
        if (res.line_id) {
          this.story_state = res;
        }
        if (res.output && res.output.length > 0) {
          // TYLER'S SUPER JANKY AUDIO THING

          if (res.diagrams.length > 0) {
            this.current_diagram = res.diagrams[res.diagrams.length - 1];
          }

          this.pause = false;
          if (res.play) {
            if (res.play.action === 'END') {
              delete this.story_state.play;
              this.setState({ audioplayer: false });
            } else {
              this.setState({ audioplayer: true });
              if (res.play.action === 'START') {
                if (this.next) {
                  res.output = `<audio src="${res.play.url}" />`;
                } else {
                  res.output += `<audio src="${res.play.url}" />`;
                }
              } else if (res.play.action === 'PAUSE') {
                this.pause = true;
                if (audio) audio.pause();
              } else if (res.play.action === 'RESUME') {
                if (audio) {
                  audio.play();
                }
                return;
              }
            }
          } else {
            this.setState({ audioplayer: false });
          }

          const dom = parse(`<speak>${res.output}</speak>`);

          if (dom && dom.length > 0 && dom[0].type === 'tag' && dom[0].name === 'speak' && dom[0].children) {
            if (!this.pause) this.removeAudio();
            this.recursivePlay(0, dom[0].children, res.ending);
          } else {
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
        } else if (res.ending) {
          this.handleEnd();
        }
        this.next = false;
      })
      .catch((err) => {
        this.setState({
          error: err,
        });
        this.next = false;
      });
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  inputSubmit(e) {
    const { input, audio, inputs, intent } = this.state;
    if (e) e.preventDefault();

    if (input === 'SKIP LINE') {
      if (audio !== null) {
        audio.onended();
      }
      this.setState({
        input: '',
      });
    } else {
      if (intent) {
        this.story_state.intent = intent;
      } else {
        this.story_state.input = input;
        inputs.push({
          self: input,
          time: moment().format('h:mm:ss A'),
        });
      }

      this.setState(
        {
          input: '',
          intent: '',
          inputs,
        },
        this.updateState
      );
    }

    return false;
  }

  onKeyDown(event) {
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (event.key === 'Enter') {
      this.inputSubmit(event);
    }
  }

  handleLineSelection(selectedOption) {
    this.setState({
      selected_line: selectedOption,
    });
  }

  startline() {
    const { selected_line } = this.state;
    if (!selected_line) return;
    this.initializeStory();
    this.story_state.line_id = selected_line.value;
    this.setState(
      {
        started: true,
      },
      () => {
        this.updateState(true);
      }
    );
  }

  beginning() {
    this.setState({
      started: true,
    });
    this.initializeStory();
    this.updateState(true);
  }

  getVariables() {
    const state = this.story_state;
    if (Array.isArray(state.globals) && state.globals.length !== 0) {
      if (!this.current_diagram) {
        return null;
      }
      const variables = this.current_diagram.variable_state;
      const v_array = [];
      const g_array = [];
      Object.keys(variables).forEach((key) =>
        v_array.push({
          name: key,
          value: variables[key],
        })
      );

      const globals = state.globals[0];
      Object.keys(globals).forEach((key) =>
        g_array.push({
          name: key,
          value: globals[key],
        })
      );

      return (
        <React.Fragment>
          <label>Local Variables</label>
          <Table className="var-table">
            <tbody>{v_array.map(renderVariable)}</tbody>
          </Table>
          <label>Global Variables</label>
          <Table className="var-table">
            <tbody>{g_array.map(renderVariable)}</tbody>
          </Table>
        </React.Fragment>
      );
    }
    return null;
  }

  render() {
    const { started, inputs, debug, ended, audioplayer, selected_line, nodes, input } = this.state;
    const { open, toggle, testing_info, flow } = this.props;
    return (
      <Modal isOpen={open} size="lg">
        <ModalHeader toggle={toggle} header="Project Testing" />
        <ModalBody className="text-center env-modal test-modal">
          {testing_info !== false ? (
            <React.Fragment>
              <div className="row">
                <div className="col-sm-8 p-0 test-main">
                  {started ? (
                    <React.Fragment>
                      <div className="chatbox px-3">
                        <div className="chats">
                          {inputs.map((chat, i) => {
                            if (chat.self) {
                              return (
                                <div className="mt-2 text-right" key={i}>
                                  <div className="self-message message border rounded p-2 align-self-start">
                                    <p className="mb-0 px-1 text-left">
                                      {chat.self}
                                      <br />
                                      <small className="text-muted">{chat.time}</small>
                                    </p>
                                  </div>
                                </div>
                              );
                            }
                            if (chat.debug) {
                              if (!debug) {
                                return null;
                              }
                              return (
                                <div className="mt-2 text-left" key={i}>
                                  <div className="message border rounded p-2 align-self-start debug">
                                    <div className="mb-0 px-1 text-left">
                                      <small>{chat.debug}</small>
                                      <pre className="mb-2">{chat.text}</pre>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            if (chat.text) {
                              return (
                                <div className="mt-2 text-left" key={i}>
                                  <div className="message border rounded p-2 align-self-start">
                                    <p className="mb-0 px-1 text-left">
                                      {chat.text}
                                      <br />
                                      <small className="text-muted">{chat.time}</small>
                                    </p>
                                  </div>
                                </div>
                              );
                            }
                            return (
                              <div className="mt-2 text-left" key={i}>
                                <div className="message border rounded align-self-start">
                                  <div className="message-container p-2">
                                    <p className="mb-0 px-1 text-left">
                                      <span className="text-muted">
                                        <i className="fas fa-volume-up" />
                                      </span>{' '}
                                      {chat.src}
                                      <br />
                                      <small className="text-muted">{chat.time}</small>
                                    </p>
                                  </div>
                                  <div className="message-progress" style={{ width: `${(chat.currentTime / chat.duration) * 100}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {ended ? (
                        <Alert onClick={this.handleRestart} color="warning" className="m-3">
                          Flow Ended - Reset <i className="far fa-sync-alt" />
                        </Alert>
                      ) : (
                        <React.Fragment>
                          {audioplayer ? (
                            <div className="audioplayer-options mb-2">
                              {this.pause ? (
                                <Button outline color="primary" onClick={() => this.setState({ intent: 'AMAZON.ResumeIntent' }, this.inputSubmit)}>
                                  Resume
                                </Button>
                              ) : (
                                <Button outline color="primary" onClick={() => this.setState({ intent: 'AMAZON.PauseIntent' }, this.inputSubmit)}>
                                  Stop/Pause
                                </Button>
                              )}
                              <Button outline color="primary" onClick={() => this.setState({ intent: 'AMAZON.NextIntent' }, this.inputSubmit)}>
                                Next
                              </Button>
                              <Button outline color="primary" onClick={() => this.setState({ intent: 'AMAZON.PreviousIntent' }, this.inputSubmit)}>
                                Previous
                              </Button>
                            </div>
                          ) : (
                            <Form onSubmit={this.inputSubmit} className="px-3 mb-3">
                              <InputGroup>
                                <Input
                                  className="form-bg form-control"
                                  name="input"
                                  type="text"
                                  placeholder="response"
                                  value={input}
                                  onChange={this.handleChange}
                                  onKeyDown={this.onKeyDown}
                                />
                                <InputGroupAddon addonType="append">
                                  <Button color="primary btn-thicc" type="submit">
                                    <i className="fas fa-bullhorn" />
                                  </Button>
                                </InputGroupAddon>
                              </InputGroup>
                            </Form>
                          )}
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  ) : (
                    <div className="p-3">
                      <h6 className="mt-3 mb-3">Start Project from the beginning</h6>
                      <DefaultButton isPrimary className="mb-3" onClick={this.beginning}>
                        <i className="fas fa-play" />
                        &nbsp;&nbsp;&nbsp;Start Test
                      </DefaultButton>
                      <div className="break">
                        <span className="break-text">OR</span>
                      </div>
                      <h6 className="mt-4 mb-3">Start from a specific point in the project</h6>
                      <Select
                        classNamePrefix="select-box"
                        className="text-left mb-3 w-75 ml-5 pl-4"
                        value={selected_line}
                        onChange={this.handleLineSelection}
                        options={nodes}
                      />
                      <DefaultButton isPrimary onClick={this.startline}>
                        <i className="fas fa-fast-forward" />
                        &nbsp;&nbsp;&nbsp;Start From Block
                      </DefaultButton>
                    </div>
                  )}
                </div>
                <div className="col-sm-4 text-left test-sidebar">
                  <b>{started && debug ? 'Variable State' : 'Test Tool'}</b>
                  <div className="debug-switch space-between mt-2">
                    <label>Debug Mode</label>
                    <Toggle
                      icons={false}
                      checked={debug}
                      onChange={() => {
                        this.setState((prev_state) => ({ debug: !prev_state.debug }));
                      }}
                      value={`${debug}`}
                    />
                  </div>
                  {started && debug ? (
                    <React.Fragment>
                      <small className="py-2">
                        Current Flow: <b>{flow}</b>
                      </small>
                      <div className="sidebar-scroll">{this.getVariables()}</div>
                    </React.Fragment>
                  ) : (
                    <div className="sidebar-scroll">
                      <ListGroup flush>
                        <ListGroupItem tag="p">This Test Tool simulates voice apps in the browser</ListGroupItem>
                        <ListGroupItem tag="p">
                          You don't have to wait for the speech to complete before typing or saying your next response
                        </ListGroupItem>
                        <ListGroupItem tag="p">SSML tags are not displayed but will work in production on Google/Alexa</ListGroupItem>
                        <ListGroupItem tag="p">Debug Mode shows you block by block paths/variables</ListGroupItem>
                      </ListGroup>
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          ) : (
            <div className="p-5">
              <h1>
                <span className="loader" />
              </h1>
            </div>
          )}
        </ModalBody>
        <ModalFooter className="justify-content-center">
          <DefaultButton isClear onClick={toggle}>
            Close
          </DefaultButton>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  global: state.skills.skill.global,
  repeat: state.skills.skill.repeat,
  slots: state.skills.skill.slots,
  platform: state.skills.skill.platform,
});
export default connect(mapStateToProps)(TestModal);
