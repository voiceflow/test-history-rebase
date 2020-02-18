import cn from 'classnames';
import React from 'react';
import withSpeechRecognition from 'react-speech-recognition';
import Textarea from 'react-textarea-autosize';
import { Collapse } from 'reactstrap';

import Button from '@/components/LegacyButton';
import SvgIcon from '@/components/SvgIcon';

import SpeakBox from './SpeakBox';
import SpeechBar from './SpeechBar';

class TestBox extends React.PureComponent {
  state = {
    input: '',
    listening: false,
    microphone: false,
    inputOpen: true,
  };

  async componentDidMount() {
    if (this.props.browserSupportsSpeechRecognition) {
      await this.checkMicrophone();
      this.bindSpaceKeySpeech();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.spaceDownBind);
  }

  startListening = () => {
    if (this.props.locale && this.props.locale.length === 5) {
      this.props.recognition.lang = this.props.locale;
    }
    this.setState({ microphone: true });
    this.props.startListening();
  };

  checkMicrophone = () =>
    new Promise(async (resolve) => {
      if (!this.state.microphone) {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
        if (permissionStatus.state === 'granted') {
          this.startListening();
        } else if (!this.microphonePrompt) {
          // prompts stack on top of each other (i.e. the moment they close it another will pop up)
          // this tracks the state of the prompt so we're sure we are not invoking more than one concurrently
          this.microphonePrompt = true;
          // eslint-disable-next-line compat/compat
          navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(() => {
              this.microphonePrompt = false;
              this.startListening();
            })
            .catch(() => {
              this.microphonePrompt = false;
            });
        }
        resolve();
      }
    });

  bindSpaceKeySpeech = () => {
    // bind space key to start listening only if microphone enabled
    this.spaceDownBind = (e) => {
      if (e.which === 32) {
        switch (e.target.tagName.toLowerCase()) {
          case 'input':
          case 'textarea':
            return;
          default:
            break;
        }
        e.preventDefault();
        e.stopPropagation();

        if (this.listen()) {
          const spaceUpBind = (e) => {
            if (e.which === 32) {
              this.stopListen();
              document.removeEventListener('keyup', spaceUpBind);
            }
          };
          document.addEventListener('keyup', spaceUpBind);
        }
      }
    };
    document.addEventListener('keydown', this.spaceDownBind);
  };

  toggleInputOpen = (value) => this.setState({ inputOpen: value === true || value === false ? value : !this.state.inputOpen });

  setInput = (input) => this.setState({ input });

  submit = (value, reset = false) => {
    if (this.props.ended) return;
    this.props.inputSubmit(value);

    if (reset) this.setInput('');
  };

  onKeydown = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      this.submit(this.state.input, true);
    }
  };

  stopListen = () => {
    const { finalTranscript, interimTranscript } = this.props;
    this.setState({ listening: false }, () => {
      const combined = `${finalTranscript} ${interimTranscript}`.trim();
      if (combined) {
        this.submit(combined, true);
      }
    });
  };

  listenClick = () => {
    if (this.listen()) {
      document.addEventListener('mouseup', this.stopListen, { once: true });
    }
  };

  listen = () => {
    if (this.props.ended || this.state.listening) return false;

    this.checkMicrophone();
    this.props.resetTranscript();
    this.setState({ listening: true, inputOpen: false });

    return true;
  };

  render() {
    const {
      outputs,
      debug,
      options,
      ended,
      playAudio,
      handleRestart,
      loading,
      interimTranscript,
      finalTranscript,
      browserSupportsSpeechRecognition,
    } = this.props;
    const { input, listening, inputOpen, microphone } = this.state;

    return (
      <div className="dialog">
        <div className="chat-container">
          <div className="chatbox">
            <div className="chats">
              <div className="break" style={{ top: -20 }}>
                <span className="break-text">New Session Started</span>
              </div>
              {outputs.map((chat, i) => {
                if (chat.self) {
                  return (
                    <div className="self-message" key={i}>
                      <div className="message">
                        <p className="mb-0 px-1 text-left">
                          {chat.self}
                          <br />
                        </p>
                      </div>
                      <img src="/user_reply.svg" height={18} width={18} alt="user" className="speak-box-icon" />
                    </div>
                  );
                }
                return <SpeakBox key={i} debug={debug} chat={chat} playAudio={playAudio} />;
              })}
              {loading && (
                <div className="message-container">
                  <div className="message pointer align-self-start super-center" style={{ minWidth: 100, marginLeft: 26, minHeight: 40 }}>
                    <span className="save-loader" />
                  </div>
                </div>
              )}
              {!loading && options && (
                <div className="choice-options mt-4">
                  {options.length ? (
                    options.map((option, i) => (
                      <div key={i} className="choice-option mb-1" onClick={() => this.submit(option)}>
                        {option && option.label ? option.label : option}
                      </div>
                    ))
                  ) : (
                    <div className="text-dull">Waiting for user response</div>
                  )}
                </div>
              )}
              {ended && (
                <>
                  <div className="break mt-4">
                    <span className="break-text">Session Ended</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="no-space__break" />
        <div id="TestInputContainer">
          {ended ? (
            <div className="condition-label centered">
              <Button isBtn isLink onClick={handleRestart}>
                Reset Test
              </Button>
            </div>
          ) : (
            <div className="condition-label pointer" onClick={this.toggleInputOpen}>
              <label className="mb-0">{listening ? 'Listening...' : 'User Says'}</label>

              <SvgIcon
                icon="arrowLeft"
                width={24}
                height={13}
                style={{ transform: `rotate(${inputOpen ? -90 : 90}deg)` }}
                color="#8da2b5"
                transition="transform"
              />
            </div>
          )}
          <Collapse isOpen={inputOpen && !ended}>
            <div id="TestInput" className={cn({ disabled: ended })}>
              <Textarea
                className="editor"
                placeholder="Enter response"
                value={input}
                onChange={(e) => !ended && this.setInput(e.target.value)}
                onKeyDown={this.onKeydown}
              />
              <small className="text-muted ml-1">Press 'Enter' to send</small>
            </div>
          </Collapse>
        </div>
        <SpeechBar
          ended={ended}
          listening={listening}
          interimTranscript={interimTranscript}
          finalTranscript={finalTranscript}
          listenClick={this.listenClick}
          browserSupport={browserSupportsSpeechRecognition}
          microphone={microphone}
        />
      </div>
    );
  }
}

export default withSpeechRecognition({ autoStart: false })(TestBox);
