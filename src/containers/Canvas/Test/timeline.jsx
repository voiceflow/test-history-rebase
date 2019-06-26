import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { DEFAULT_INTENTS } from 'Constants';

import TestBox from './TestBox';
import { getDiagramIntents, getUserTestOutputs } from './utils';

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
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
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

  updateState = async (start = false) => {
    const { testing_info, skill, diagramEngine, variableMapping } = this.props;
    const { nlc } = testing_info;
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
        const { diagram_intents, detected_intents } = getDiagramIntents(diagramEngine, results, testing_info);
        data.diagram_intents = diagram_intents;
        data.detected_intents = detected_intents;
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
          const userTestOutputs = await getUserTestOutputs(data, trace, res, variableMapping);
          this.setState({
            outputs: this.state.outputs.concat(userTestOutputs),
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
    const { inputs, ended, outputs, lastNode } = this.state;
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
          setAudio={(audio) => {
            this.setState({
              audio,
            });
          }}
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
