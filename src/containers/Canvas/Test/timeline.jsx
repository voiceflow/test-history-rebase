import axios from 'axios';
import { parse } from 'html-parse-stringify';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
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
let story_state = null;
let pause = false;
let next = false;

const Timeline = (props) => {
  const {
    time,
    slots,
    skill,
    reset,
    global,
    repeat,
    history,
    enterFlow,
    platform,
    setTime,
    setReset,
    resume,
    stop,
    diagramEngine,
    testing_info,
    resetTest,
    variableMapping,
  } = props;

  const initializeStory = () => {
    story_state = {
      diagrams: null,
      input: '',
      line: null,
      testing: true,
      skill_id: 'TEST_SKILL',
      globals: [{}],
      repeat: repeat || 100,
      platform,
    };
    if (Array.isArray(global)) {
      global.forEach((variable) => {
        story_state.globals[0][variable] = 0;
      });
    }

    story_state.globals[0].sessions = 1;
    story_state.globals[0].user_id = 'TEST_USER';
    story_state.globals[0].platform = platform;
  };

  const [outputs, setOutputs] = useState([]);
  const [inputs, setInputs] = useState([]);
  const [input, setInput] = useState('');
  const [intent, setIntent] = useState('');
  const [ended, setEnded] = useState(false);
  const [started, setStarted] = useState(false);
  const [audioPlayer, toggleAudioPlayer] = useState(false);
  const [audio, setAudio] = useState(null);
  const [lastNode, setLastNode] = useState(null);

  useEffect(() => {
    if (testing_info && !started) {
      setStarted(true);
      initializeStory();
      // eslint-disable-next-line no-use-before-define
      updateState(true);
      resume();
    }
    if (reset && started) {
      setStarted(false);
      setTime(0);
      setInputs([]);
      setOutputs([]);
      setEnded(false);
      // resetTest();
      story_state = null;
      // stop();
      setReset(false);
    }
  });

  useEffect(() => {
    return () => {
      setStarted(false);
      setTime(0);
      setInputs([]);
      setOutputs([]);
      setEnded(false);
      resetTest();
      story_state = null;
      stop();
    };
  }, []);

  if (!testing_info) {
    return (
      <div className="text-center mb-3">
        <img className="mb-3 mt-5" src="/Testing.svg" alt="user" width="80" />
        <br />
        <span className="text-muted">Start test to see the dialog transcription</span>
      </div>
    );
  }

  const handleRestart = () => {
    setStarted(false);
    setTime(0);
    setInputs([]);
    setOutputs([]);
    setEnded(false);
    resetTest();
    story_state = null;
  };

  const removeAudio = () => {
    return new Promise((resolve) => {
      if (audio) {
        audio.onended = null;
        audio.ontimeupdate = null;
        audio.onloadedmetadata = null;
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
        setAudio(null);
        resolve();
      } else {
        resolve();
      }
    });
  };
  const addDebugBlock = (block) => {
    const text = _.get(block, ['children', 0, 'content']);

    inputs.push({
      debug: block.attrs.type,
      text,
      time: moment().format('h:mm:ss A'),
    });
    setInputs(inputs);
  };

  const parseBlock = (block) => {
    const text = recurse(block);
    if (text) {
      inputs.push({
        text,
        time: moment().format('h:mm:ss A'),
      });
      setInputs(inputs);
    }
  };

  const recursivePlay = (index, urls, ended) => {
    if (index >= urls.length) {
      if (!pause) {
        setAudio(null);
        if (story_state.play && ['START', 'RESUME'].includes(story_state.play.action)) {
          next = true;
          // eslint-disable-next-line no-use-before-define
          updateState();
        }
      }
      if (ended) {
        setEnded(true);
      }
      return;
    }

    const b = urls[index];
    if (b.type === 'tag' && b.name === 'audio' && b.attrs && b.attrs.src) {
      // AUDIO TAGS

      const audio = new Audio(b.attrs.src);

      setAudio(audio);

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
        setInputs(inputs);
        recursivePlay(index + 1, urls, ended);
        console.error(err);
      };

      audio.onended = () => {
        recursivePlay(index + 1, urls, ended);
        audio.ontimeupdate = null;
        audio.onended = null;
        audio.onloadedmetadata = null;
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      };
      audio.onloadedmetadata = () => {
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
        // setInputs(update(inputs, {
        //   $push: [{
        //     src: audio.src.split('/').pop().split('-').pop(),
        //     currentTime: 0,
        //     duration: audio.duration,
        //     time: moment().format('h:mm:ss A')
        //   }]
        // }))
        setInputs(inputs);
        audio.ontimeupdate = () => {
          inputs[index - 1].currentTime = audio.currentTime;
          setInputs(inputs);
        };
      };

      audio.play();
    } else if (b.type === 'tag' && b.name === 'debug') {
      addDebugBlock(b);
      recursivePlay(index + 1, urls, ended);
    } else {
      parseBlock(b);
      recursivePlay(index + 1, urls, ended);
    }
  };

  const getAudioMeta = (audio) => {
    return new Promise((resolve) => {
      audio.addEventListener('loadedmetadata', (e) => {
        resolve(e.target.duration);
      });
    });
  };

  const updateState = async (start = false) => {
    const nlc = testing_info.nlc;
    const data = story_state;
    if (!data.slots) {
      data.slots = slots;
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
          const slot_mapping = testing_info.slot_mappings[intent_name] ? testing_info.slot_mappings[intent_name] : [];
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
        line: story_state.line_id ? story_state.line_id : 'START',
      };
      data.diagrams = [{ id: testing_info.id }];
    }

    if (next) {
      if (story_state.play.loop) {
        await removeAudio();
        next = false;
        return recursivePlay(
          0,
          [
            {
              name: 'audio',
              type: 'tag',
              attrs: {
                src: story_state.play.url,
              },
            },
          ],
          false
        );
      }
      data.play.action = 'NEXT';
    }
    axios
      .post('/test/interact', data)
      .then(async (res) => {
        // eslint-disable-next-line no-param-reassign
        res = res.data;
        const { trace } = res;
        if (res.line_id) {
          story_state = res;
        }
        if (data.input && !data.trace) return;
        if (res.output && res.output.length > 0) {
          // TYLER'S SUPER JANKY AUDIO THING

          pause = false;
          if (res.play) {
            if (res.play.action === 'END') {
              delete story_state.play;
              toggleAudioPlayer(false);
            } else {
              toggleAudioPlayer(true);
              if (res.play.action === 'START') {
                if (next) {
                  res.output = `<audio src="${res.play.url}" />`;
                } else {
                  res.output += `<audio src="${res.play.url}" />`;
                }
              } else if (res.play.action === 'PAUSE') {
                pause = true;
                if (audio) audio.pause();
              } else if (res.play.action === 'RESUME') {
                if (audio) {
                  audio.play();
                }
                return;
              }
            }
          } else {
            toggleAudioPlayer(false);
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
            // eslint-disable-next-line no-continue
            if (!block.output) continue;
            const type = block.block;
            const parsed = parse(block.output)[0];
            if (type === 'Speak') {
              // eslint-disable-next-line no-await-in-loop
              const results = await Promise.all(
                block.audio.map(async (audioFile) => {
                  const audio = new Audio(audioFile);
                  return { duration: await getAudioMeta(audio), audio };
                })
              );
              // eslint-disable-next-line lodash/collection-return, lodash/collection-method-value, no-loop-func
              _.map(parsed.children, (child, idx) => {
                const outputBlock = {};
                if (child.name === 'audio') {
                  outputBlock.text = 'Audio File';
                } else {
                  const replaced = RegexVariables(child.children[0].content, variableMapping);
                  outputBlock.text = replaced;
                }
                outputBlock.audio = results[idx].audio;
                outputBlock.node = block.line.id;
                outputBlock.audioType = child.name;
                const duration = results[idx].duration * 1000;
                outputBlock.delay = delay;
                outputBlock.type = type;
                outputBlock.isLast = !block.line.nextId;
                delay += duration + 500;
                dom.push(outputBlock);
              });
            } else if (type === 'Choice' && idx === trace.length - 1) {
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
              dom.push(outputBlock);
            } else {
              const outputBlock = {
                isLast: !block.line.nextId,
                node: block.line.id,
                type,
                delay,
              };
              delay += 500;
              dom.push(outputBlock);
            }
            idx++;
          }
          setOutputs(outputs.concat(dom));
        } else if (res.ending) {
          setEnded(true);
        }
        next = false;
      })
      .catch((err) => {
        console.error(err);
        next = false;
      });
  };

  const inputSubmit = (e, val = null) => {
    if (e) e.preventDefault();
    if (input === 'SKIP LINE' || val === 'SKIP LINE') {
      if (audio !== null) {
        audio.onended();
      }
      setInput('');
    } else {
      if (intent) {
        story_state.intent = intent;
      } else {
        story_state.input = val || input;
        inputs.push({
          self: val || input,
          time: moment().format('h:mm:ss A'),
        });
      }
      e.currentTarget.value = '';
      setInput('');
      setIntent('');
      setInputs(inputs);
      updateState();
    }

    return false;
  };

  return (
    <div id="Timeline" className="mb-3">
      <div className="no-margin__break">
        <span className="or">New Session Started</span>
        <TestBox
          inputs={inputs}
          diagramEngine={diagramEngine}
          history={history}
          ended={ended}
          enterFlow={enterFlow}
          setEnded={setEnded}
          audioPlayer={audioPlayer}
          handleRestart={handleRestart}
          handleChange={(e) => setInput(e.target.value)}
          inputSubmit={inputSubmit}
          setInput={(val) => setInput(val)}
          resetTest={resetTest}
          outputs={outputs}
          lastNode={lastNode}
          setLastNode={setLastNode}
          time={moment.utc(time * 1000).format('mm:ss')}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  skill: state.skills.skill,
});

export default compose(connect(mapStateToProps))(Timeline);
