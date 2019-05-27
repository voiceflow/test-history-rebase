import React, { useState, useEffect } from "react";
import _ from 'lodash'
import axios from 'axios'
import moment from 'moment'
import { compose } from "recompose";
import { connect } from "react-redux";
import { parse } from 'html-parse-stringify'
import cn from 'classnames'

import { useToggle } from 'hooks/toggle'

import TestBox from './TestBox'

const valid_tags = new Set([
  "voice",
  "prosody",
  "break",
  "s",
  "w",
  "sub",
  "say-as",
  "phoneme",
  "p",
  "lang",
  "emphasis",
  "amazon:effect",
  "text"
]);

const recurse = (tag, index = 0) => {
  if (tag.type === 'text') {
    if (!tag.content.trim()) {
      return null
    } else {
      return tag.content
    }
  } else {
    if (!valid_tags.has(tag.name)) { return null }

    if (tag.children && tag.children.length > 0) {
      let return_string = [];
      tag.children.forEach((t, i) => {
        return_string.push(recurse(t, i));
      });

      if (tag.name === 's') {
        return return_string;
      } else if (tag.name === 'voice') {
        return <React.Fragment key={index}><span className="text-muted">{tag.attrs.name}:</span>
          <br />
          {return_string}
        </React.Fragment>
      } else {
        return <span key={index} className="tag-wrap"><span className="tag-span">{tag.name}</span> {return_string}</span>
      }
    } else {
      return <span key={index} className="tag-wrap tag-span">({tag.name})</span>
    }
  }
}
let story_state = null;
let pause = false;
let next = false;

const Timeline = props => {
  const {
    slots,
    global,
    repeat,
    platform,
    timeline,
    testing_info,
  } = props

  let current_diagram = null;
  const [outputs, setOutputs] = useState([])
  const [inputs, setInputs] = useState([])
  const [input, setInput] = useState("")
  const [intent, setIntent] = useState("")
  const [ended, setEnded] = useState(false);
  const [started, setStarted] = useState(false)
  const [audioPlayer, toggleAudioPlayer] = useState(false)
  const [audio, setAudio] = useState(null)

  if (!testing_info) {
    return <div className="text-center mb-3">
      <img className="mb-3 mt-5" src={'/Testing.svg'} alt="user" width="80" /><br />
      <span className="text-muted">Waiting for a new session...</span><br />
      <span className="text-muted">Launch the skill on your Echo device</span>
    </div>
  }
  
  const beginning = () => {
    setStarted(true)
    initializeStory();
    updateState(true)
  }

  const initializeStory = () => {
    story_state = {
      diagrams: null,
      input: "",
      line: null,
      testing: true,
      skill_id: "TEST_SKILL",
      globals: [{}],
      repeat: repeat ? repeat : 100,
      platform: platform
    };
    console.log(story_state)
    if (Array.isArray(global)) {
      global.forEach(variable => {
        story_state.globals[0][variable] = 0
      })
    }

    story_state.globals[0].sessions = 1;
    story_state.globals[0].user_id = "TEST_USER";
    story_state.globals[0].platform = platform;
  }

  const removeAudio = () => {
    return new Promise((resolve) => {
      if (audio) { 
        audio.onended = null;
        audio.ontimeupdate = null;
        audio.onloadedmetadata = null;
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
        setAudio(null)
        resolve()
      } else {
        resolve()
      }
    })
  }

  const recursivePlay = (index, urls, ended) => {
    if (index >= urls.length) {
      if (!pause) {
        setAudio(null);
        if (story_state.play && ['START', 'RESUME'].includes(story_state.play.action)) {
          next = true
          updateState()
        }
      }
      if (ended) {
        setEnded(true)
      }
      return
    }

    let b = urls[index];
    if (b.type === 'tag' && b.name === 'audio' && b.attrs && b.attrs.src) {
      // AUDIO TAGS
      let audio
      audio = new Audio(b.attrs.src)

      setAudio(audio)

      audio.onerror = (err) => {
        let inputs = inputs
        inputs.push({
          text: <span className="alert alert-warning mb-1 d-inline-block">Unable to Play Audio File on Test Tool<br /><b>{b.attrs.src}</b>{b.attrs.src.startsWith('soundbank') && <React.Fragment><br />(Soundbank Files will work on Alexa)</React.Fragment>}</span>,
          time: moment().format('h:mm:ss A')
        })
        setInputs(inputs)
        recursivePlay(index + 1, urls, ended)
      }

      audio.onended = () => {
        recursivePlay(index + 1, urls, ended)
        audio.ontimeupdate = null;
        audio.onended = null;
        audio.onloadedmetadata = null;
        audio.pause()
        audio.removeAttribute('src')
        audio.load()
      }
      audio.onloadedmetadata = () => {
        let index = inputs.push({
          src: audio.src.split('/').pop().split('-').pop(),
          currentTime: 0,
          duration: audio.duration,
          time: moment().format('h:mm:ss A')
        })
        // setInputs(update(inputs, {
        //   $push: [{
        //     src: audio.src.split('/').pop().split('-').pop(),
        //     currentTime: 0,
        //     duration: audio.duration,
        //     time: moment().format('h:mm:ss A')
        //   }]
        // }))
        setInputs(inputs)
        audio.ontimeupdate = () => {
          inputs[index - 1].currentTime = audio.currentTime;
          setInputs(inputs)
        }
      }

      audio.play()
    } else if (b.type === 'tag' && b.name === 'debug') {
      addDebugBlock(b)
      recursivePlay(index + 1, urls, ended)
    } else {
      console.log('called parseblock')
      parseBlock(b)
      recursivePlay(index + 1, urls, ended)
    }
  }

  const addDebugBlock = block => {
    let text = block.children && block.children[0] && block.children[0].content ? block.children[0].content : '';

    inputs.push({
      debug: block.attrs.type,
      text: text,
      time: moment().format('h:mm:ss A')
    });
    setInputs(inputs)
  }

  const parseBlock = block => {
    let text = recurse(block);
    if (text) {
      inputs.push({
        text: text,
        time: moment().format('h:mm:ss A')
      });
      setInputs(inputs)
    }
  }

  const handleRestart = () => {
    setStarted(false)
    setInputs([])
    setEnded(false);
    story_state = null;
  }

  const inputSubmit = e => {
    if (e) e.preventDefault();

    if (input === 'SKIP LINE') {
      if (audio !== null) {
        audio.onended()
      }
      setInput("")
    } else {
      if (intent) {
        story_state.intent = intent
      } else {
        story_state.input = input
        inputs.push({
          self: input,
          time: moment().format('h:mm:ss A')
        })
      }
      setInput("")
      setIntent("")
      setInputs(inputs)
      updateState()
    }

    return false;
  }

  const getAudioMeta = audio => {
    return new Promise(res => {
      audio.addEventListener('loadedmetadata', (e) => {
        res(e.target.duration)
      });
    })
  }

  const updateState = async(start = false) => {
    const nlc = testing_info.nlc
    let data = story_state;

    if (!data.slots) {
      data.slots = slots
    }
    if (nlc) {
      try {
        const results = await nlc.handleCommand(data.input)
        const detected_intents = []

        _.forEach(results, result => {
          const intent_name = result.name;
          const detected_slots = result.slots;
          const slot_mapping = testing_info.slot_mappings[intent_name] ? testing_info.slot_mappings[intent_name] : []
          const formatted_slots = {}

          slot_mapping.forEach((slot, i) => {
            if (detected_slots) {
              formatted_slots[slot.name] = {
                value: detected_slots[i]
              }
            }
          })
          if (intent_name) {
            detected_intents.push({
              intent: intent_name,
              slots: formatted_slots
            })
          }
          data.detected_intents = detected_intents
        })
      } catch (err) {
        // NLC No Match'
        console.error('NLC No Match')
      }
    }

    if (start) {
      data.testing = {
        line: story_state.line_id ? story_state.line_id : "START",
      };
      data.diagrams = [{ id: testing_info.id }]
    }

    if (next) {
      if (story_state.play.loop) {
        await removeAudio()
        next = false
        return recursivePlay(0, [{
          name: 'audio',
          type: 'tag',
          attrs: {
            src: story_state.play.url
          }
        }], false);
      } else {
        data.play.action = 'NEXT';
      }
    }
    axios.post('/test/interact', data)
      .then(async res => {
        res = res.data
        const {
           trace 
        } = res
        if (res.line_id) {
          story_state = res
        }
        if (res.output && res.output.length > 0) {
          // TYLER'S SUPER JANKY AUDIO THING

          if (res.diagrams.length > 0) {
            current_diagram = res.diagrams[res.diagrams.length - 1]
          }

          pause = false;
          if (res.play) {
            if (res.play.action === 'END') {
              delete story_state.play;
              toggleAudioPlayer(false)
            } else {
              toggleAudioPlayer(true)
              if (res.play.action === 'START') {
                if (next) {
                  res.output = '<audio src="' + res.play.url + '" />';
                } else {
                  res.output += '<audio src="' + res.play.url + '" />';
                }
              } else if (res.play.action === 'PAUSE') {
                pause = true
                if (audio) audio.pause()
              } else if (res.play.action === 'RESUME') {
                if (audio) {
                  audio.play()
                }
                return;
              }
            }
          } else {
            toggleAudioPlayer(false)
          }
          let dom = []
          let delay = 0;
          for (const block of trace) {
            const type = block.block
            let parsed = parse(block.output)[0]
            let outputBlock = {}
            outputBlock.type = type
            if (type === 'Speak') {
              const audio = new Audio(block.audio[0])
              outputBlock.voice = parsed.children[0].attrs.name
              outputBlock.text = parsed.children[0].children[0].content
              outputBlock.audio = audio
              const duration = await getAudioMeta(audio)
              outputBlock.delay = delay
              delay += duration + 1000
              dom.push(outputBlock)
            } else {
              //   setEnded(true)
            }
          }
          console.log(dom)
          setOutputs(dom)
        } else if (res.ending) {
          setEnded(true)
        }
        next = false;
      })
      .catch(err => {
        console.error(err)
        next = false;
      });
  }

  return (
    <div id="Timeline" className="mb-3">
      <div className="break">
        <span className="or">New Session Started</span>
        <TestBox
          inputs={inputs}
          ended={ended}
          setEnded={setEnded}
          audioPlayer={audioPlayer}
          handleRestart={handleRestart}
          handleChange={e => setInput(e.target.value)}
          inputSubmit={inputSubmit}
          outputs={outputs}
        />
        <button className="btn-primary mb-3" onClick={() => beginning()}>
          <i className="fas fa-play" />
          &nbsp;&nbsp;&nbsp;Start Test
        </button>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({});
export default compose(
  connect(mapStateToProps)
)(Timeline);
