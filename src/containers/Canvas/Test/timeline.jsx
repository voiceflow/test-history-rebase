import axios from 'axios';
import { parse } from 'html-parse-stringify';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { RegexVariables } from 'utils/variable';

import { DEFAULT_INTENTS } from 'Constants';

import TestBox from './TestBox';

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
    const returnString = [];
    tag.children.forEach((t, i) => {
      returnString.push(recurse(t, i));
    });

    if (tag.name === 's') {
      return returnString;
    }
    if (tag.name === 'voice') {
      return (
        <React.Fragment key={index}>
          <span className="text-muted">{tag.attrs.name}:</span>
          <br />
          {returnString}
        </React.Fragment>
      );
    }
    return (
      <span key={index} className="tag-wrap">
        <span className="tag-span">{tag.name}</span> {returnString}
      </span>
    );
  }
  return (
    <span key={index} className="tag-wrap tag-span">
      ({tag.name})
    </span>
  );
};

class Timeline extends React.Component {
  state = {
    outputs: [],
    inputs: [],
    input: '',
    intent: '',
    ended: false,
    started: false,
    audioPlayer: false,
    audio: null,
    lastNode: null,
    homeId: null,
  };

  story_state = null;

  pause = false;

  next = false;

  componentDidUpdate() {
    const { testing_info, reset, enterFlow, setReset, open, stop, resume, resetTest } = this.props;
    const { started, homeId } = this.state;
    if (testing_info && !started) {
      this.setState({
        started: true,
      });
      this.initializeStory();
      this.updateState(true);
      resume();
    }
    if (reset && started) {
      this.handleClose();
      enterFlow(homeId, false);
      setReset(false);
    }
    if (!open && started) {
      this.handleClose();
      resetTest();
      stop();
    }
  }

  componentWillUnmount() {
    // Cleanup propagation
    const { setTime, resetTest, stop } = this.props;
    setTime(0);
    resetTest();
    stop();
  }

  initializeStory = () => {
    const { repeat, platform } = this.props.skill;
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
    this.story_state.globals[0].sessions = 1;
    this.story_state.globals[0].user_id = 'TEST_USER';
    this.story_state.globals[0].platform = platform;
  };

  handleRestart = () => {
    this.handleClose();
    this.props.resetTest();
  };

  handleClose = () => {
    const { setTime } = this.props;
    this.setState({
      started: false,
      inputs: [],
      outputs: [],
      ended: false,
    });
    setTime(0);
    this.story_state = null;
  };

  removeAudio = () => {
    const { audio } = this.state;
    return new Promise((resolve) => {
      if (audio) {
        const audio = this.state.audio;
        audio.onended = null;
        audio.ontimeupdate = null;
        audio.onloadedmetadata = null;
        this.state.audio.pause();
        this.state.audio.removeAttribute('src');
        this.state.audio.load();
        this.setState({
          audio: null,
        });
      }
      resolve();
    });
  };

  addDebugBlock = (block) => {
    const text = _.get(block, ['children', 0, 'content']);
    const inputs = this.state.inputs;
    inputs.push({
      debug: block.attrs.type,
      text,
      time: moment().format('h:mm:ss A'),
    });
    this.setState({
      inputs,
    });
  };

  parseBlock = (block) => {
    const text = recurse(block);
    if (text) {
      const inputs = this.state.inputs;
      inputs.push({
        text,
        time: moment().format('h:mm:ss A'),
      });
      this.setState({
        inputs,
      });
    }
  };

  recursivePlay = (index, urls, ended) => {
    if (index >= urls.length) {
      if (!this.pause) {
        this.setState({
          audio: null,
        });
        if (this.story_state.play && ['START', 'RESUME'].includes(this.story_state.play.action)) {
          this.next = true;
          // eslint-disable-next-line no-use-before-define
          this.updateState();
        }
      }
      if (ended) {
        this.setState({
          ended: true,
        });
      }
      return;
    }

    const b = urls[index];
    if (b.type === 'tag' && b.name === 'audio' && b.attrs && b.attrs.src) {
      // AUDIO TAGS

      const audio = new Audio(b.attrs.src);
      const inputs = this.state.inputs;
      this.setState({
        audio,
      });

      audio.onerror = (err) => {
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
        console.error(err);
      };

      audio.onended = () => {
        const audio = this.state.audio;
        this.recursivePlay(index + 1, urls, ended);
        audio.ontimeupdate = null;
        audio.onended = null;
        audio.onloadedmetadata = null;
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      };
      audio.onloadedmetadata = () => {
        const inputs = this.state.inputs;
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
        this.setState({
          inputs,
        });
        audio.ontimeupdate = () => {
          inputs[index - 1].currentTime = audio.currentTime;
          this.setState({
            inputs,
          });
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
  };

  getAudioMeta = (audio) => {
    return new Promise((resolve) => {
      audio.addEventListener('loadedmetadata', (e) => {
        resolve(e.target.duration);
      });
    });
  };

  updateState = async (start = false) => {
    const { testing_info, skill, diagramEngine, variableMapping } = this.props;
    const { nlc } = testing_info;
    const { audio } = this.state;
    const data = this.story_state;
    if (!data.slots) {
      data.slots = skill.slots;
    }
    const defaultIntents = DEFAULT_INTENTS[skill.locales[0].substring(0, 2)];
    _.forEach(defaultIntents.defaults.concat(defaultIntents.built_ins), (d_intent) => {
      if (_.some(d_intent.samples, (s) => s.toLowerCase() === data.input.toLowerCase())) {
        data.detected_intents = [
          {
            intent: d_intent.name,
            slots: d_intent.slots,
          },
        ];
      }
    });
    if (nlc) {
      try {
        const results = await nlc.handleCommand(data.input);
        const detected_intents = [];
        const diagram_intents = [];
        // eslint-disable-next-line lodash/prefer-filter
        _.forEach(diagramEngine.getDiagramModel().getNodes(), (node) => {
          if (node.extras.type === 'intent') {
            diagram_intents.push({
              id: node.id,
              google_intent: node.extras.google,
              alexa_intent: node.extras.alexa,
            });
          }
        });
        _.forEach(results, (result) => {
          const intent_name = result.name;
          const detected_slots = result.slots;
          const slot_mapping = testing_info.slot_mappings[intent_name] || [];
          const formatted_slots = {};

          slot_mapping.forEach((slot, i) => {
            if (detected_slots) {
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
          data.diagram_intents = diagram_intents;
          data.detected_intents = detected_intents;
        });
      } catch (err) {
        // NLC No Match'
        console.error('NLC No Match');
      }
    }

    if (start) {
      data.testing = {
        line: this.story_state.line_id || 'START',
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
    data.variableMapping = variableMapping;
    axios
      .post('/test/interact', data)
      .then(async (res) => {
        // eslint-disable-next-line no-param-reassign
        res = res.data;
        if (!_.isEmpty(res.diagrams)) {
          this.setState({
            homeId: res.diagrams[0].id,
          });
        }
        const { trace } = res;
        if (res.line_id) {
          this.story_state = res;
        }
        if (data.input && !data.trace) return;
        if (res.output && res.output.length > 0) {
          // TYLER'S SUPER JANKY AUDIO THING

          this.pause = false;
          if (res.play) {
            if (res.play.action === 'END') {
              delete this.story_state.play;
              this.setState({
                audioPlayer: false,
              });
            } else {
              this.setState({
                audioPlayer: true,
              });
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
            this.setState({
              audioPlayer: false,
            });
          }
          const dom = [];
          let delay = 0;
          if (data.input) {
            const outputBlock = {
              self: data.input,
              delay,
            };
            dom.push(outputBlock);
          }
          let idx = 0;
          // eslint-disable-next-line no-restricted-syntax
          for (const block of trace) {
            if (block.isExitFlow) {
              delay += 1000;
              const outputBlock = {
                node: trace[idx - 1].line.id,
                delay,
              };
              if (block.diagram) outputBlock.diagram = block.diagram;
              dom.push(outputBlock);
              // eslint-disable-next-line no-continue
              continue;
            }
            // eslint-disable-next-line no-continue
            if (!block.output) continue;
            const type = block.block;
            const parsed = parse(block.output)[0];
            if (idx === 0 && type === 'Choice' && res.ending) {
              const outputBlock = {
                node: block.line.id,
                diagram: !_.isEmpty(res.diagrams) && _.last(res.diagrams).id,
                type,
                delay,
              };
              delay += 500;
              dom.push(outputBlock);
            }
            if (type === 'Speak') {
              delay += 1000;
              // eslint-disable-next-line no-await-in-loop
              const results = await Promise.all(
                block.audio.map(async (audioFile) => {
                  const audio = new Audio(audioFile);
                  return { duration: await this.getAudioMeta(audio), audio };
                })
              );
              // eslint-disable-next-line lodash/collection-return, lodash/collection-method-value, no-loop-func
              _.map(parsed.children, (child, idx) => {
                const outputBlock = {};
                if (child.name === 'audio') {
                  outputBlock.text = 'Audio File';
                } else {
                  const replaced = RegexVariables(block.line.speak, variableMapping);
                  outputBlock.text = replaced;
                }
                outputBlock.audio = results[idx].audio;
                outputBlock.node = block.line.id;
                outputBlock.audioType = child.name;
                const duration = results[idx].duration * 1000;
                outputBlock.delay = delay;
                outputBlock.type = type;
                outputBlock.isLast = !block.line.nextId;
                delay += duration;
                dom.push(outputBlock);
              });
            } else if (type === 'Stream') {
              delay += 1000;
              // eslint-disable-next-line no-await-in-loop
              const results = await Promise.all(
                block.audio.map(async (audioFile) => {
                  const audio = new Audio(audioFile);
                  return { duration: await this.getAudioMeta(audio), audio };
                })
              );
              const duration = results[0].duration * 1000;
              const outputBlock = {
                audio: results[0].audio,
                text: 'Streaming',
                node: block.line.id,
                isLast: !block.line.nextId,
                delay,
                type,
              };
              dom.push(outputBlock);
              const outputBlockChoices = {
                options: [
                  { label: 'Resume', val: 'AMAZON.ResumeIntent' },
                  { label: 'Pause', val: 'AMAZON.PauseIntent' },
                  { label: 'Next', val: 'AMAZON.NextIntent' },
                  { label: 'Previous', val: 'AMAZON.PreviousIntent' },
                ],
                node: block.line.id,
                isLast: !block.line.nextId,
                delay,
                type,
              };
              delay += duration;
              dom.push(outputBlockChoices);
            } else if (type === 'Choice' && idx > 0) {
              const outputBlock = {
                options: _.map(block.line.inputs, _.head),
                node: block.line.id,
                type,
                delay,
              };
              dom.push(outputBlock);
            } else if (type === 'Flow') {
              const outputBlock = {
                node: block.line.id,
                diagram: block.line.diagram_id,
                isLast: !block.line.nextId,
                type,
                delay,
              };
              delay += 500;
              dom.push(outputBlock);
            } else if (type === 'One Shot Intent') {
              const outputBlock = {
                node: block.line.id,
                diagram: _.last(block.diagrams).id,
                type,
                delay,
              };
              delay += 500;
              dom.push(outputBlock);
            } else {
              if (!_.isEmpty(parsed.children)) {
                // eslint-disable-next-line lodash/collection-return, lodash/collection-method-value, no-loop-func
                _.map(parsed.children, (child) => {
                  const outputBlock = {
                    text: child.children[0].children[0].content,
                    node: block.line.id,
                    delay,
                    type: 'system',
                    isLast: !block.line.nextId,
                  };
                  dom.push(outputBlock);
                });
              }
            }
            idx++;
          }
          this.setState({
            outputs: this.state.outputs.concat(dom),
          });
        } else if (res.ending) {
          this.setState({
            ended: true,
          });
        }
        this.next = false;
      })
      .catch((err) => {
        console.error(err);
        this.next = false;
      });
  };

  inputSubmit = (e, val = null) => {
    const { input, audio, intent, inputs } = this.state;
    if (e) e.preventDefault();
    if (input === 'SKIP LINE' || val === 'SKIP LINE') {
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
        if (val) {
          this.story_state.input = val.val || val;
          inputs.push({
            self: val.label ? val.label : val,
            time: moment().format('h:mm:ss A'),
          });
        } else {
          this.story_state.input = input;
          inputs.push({
            self: input,
            time: moment().format('h:mm:ss A'),
          });
        }
      }
      e.currentTarget.value = '';
      this.setState({
        input: '',
        intent: '',
        inputs,
      });
      this.updateState();
    }

    return false;
  };

  render() {
    const { time, testing_info, diagramEngine, history, enterFlow, resetTest } = this.props;
    const { inputs, ended, audioPlayer, outputs, lastNode } = this.state;
    if (!testing_info) {
      return (
        <div className="text-center mb-3">
          <img className="mb-3 mt-5" src="/Testing.svg" alt="user" width="80" />
          <br />
          <span className="text-muted">Start test to see the dialog transcription</span>
        </div>
      );
    }
    return (
      <div id="Timeline" className="mb-3">
        <TestBox
          inputs={inputs}
          diagramEngine={diagramEngine}
          history={history}
          ended={ended}
          enterFlow={enterFlow}
          setEnded={(isEnded) => {
            this.setState({
              ended: isEnded,
            });
          }}
          setIntent={(intent) => {
            this.setState({
              intent,
            });
          }}
          audioPlayer={audioPlayer}
          handleRestart={this.handleRestart}
          handleChange={(e) => this.setState({ input: e.target.value })}
          inputSubmit={this.inputSubmit}
          setInput={(val) => this.setInput({ input: val })}
          resetTest={resetTest}
          outputs={outputs}
          lastNode={lastNode}
          setLastNode={(node) => {
            this.setState({
              lastNode: node,
            });
          }}
          time={moment.utc(time * 1000).format('mm:ss')}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  skill: state.skills.skill,
});

export default compose(connect(mapStateToProps))(Timeline);
