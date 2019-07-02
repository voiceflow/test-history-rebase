import cn from 'classnames';
import React, { PureComponent } from 'react';
import SpeechRecognition from 'react-speech-recognition';
import Textarea from 'react-textarea-autosize';
import { Alert, Collapse } from 'reactstrap';

import SpeakBox from './SpeakBox';
import SpeechBar from './SpeechBar';

class TestBox extends PureComponent {
  state = {
    input: '',
    listening: false,
    speechSupport: false,
    inputOpen: true,
  };

  async componentDidMount() {
    if (!this.props.browserSupportsSpeechRecognition) return;

    // check if microphone enabled
    const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
    if (permissionStatus.state !== 'granted') return;

    // bind space key to start listening only if microphone enabled
    this.props.startListening();
    this.setState({ speechSupport: true });
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

    this.intercomContainer = document.getElementById('intercom-container');
    if (this.intercomContainer) this.intercomContainer.style.visibility = 'hidden';
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.spaceDownBind);
    this.props.stopListening();
    if (this.intercomContainer) this.intercomContainer.style.visibility = 'visible';
  }

  toggleInputOpen = (value) => this.setState({ inputOpen: value === true || value === false ? value : !this.state.inputOpen });

  setInput = (input) => this.setState({ input });

  submit = (value, reset = false) => {
    if (this.props.ended) return;
    this.props.inputSubmit(value);

    if (reset) this.setInput('');
    // this.props.stopListening();
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
    if (!this.state.speechSupport || this.props.ended || this.state.listening) return false;
    // this.props.startListening();
    this.props.resetTranscript();
    this.setState({ listening: true, inputOpen: false });

    return true;
  };

  render() {
    const { outputs, debug, options, ended, playAudio, handleRestart, loading, interimTranscript, finalTranscript } = this.props;
    const { input, listening, inputOpen } = this.state;
    return (
      <div className="dialog">
        <SpeechBar listening={listening} interimTranscript={interimTranscript} finalTranscript={finalTranscript} listenClick={this.listenClick} />
        <div className="chat-container">
          <div className="chatbox px-3">
            <div className="chats">
              <div className="break" style={{ top: -20 }}>
                <span className="or">New Session Started</span>
              </div>
              {outputs.map((chat, i) => {
                if (chat.self) {
                  return (
                    <div className="mt-2 position-relative text-right mr-4" key={i}>
                      <div className="self-message message border rounded p-2 align-self-start">
                        <p className="mb-0 px-1 text-left">
                          {chat.self}
                          <br />
                          <small className="text-muted">{chat.time}</small>
                        </p>
                      </div>
                      <img src="/user_reply.svg" height={18} width={18} alt="user" className="speak-box-icon ml-2" />
                    </div>
                  );
                }
                return <SpeakBox key={i} debug={debug} chat={chat} playAudio={playAudio} />;
              })}
              {loading && (
                <div
                  className="message pointer border rounded p-2 align-self-start mt-2"
                  style={{ minWidth: 100, marginLeft: 24, justifyContent: 'center', alignItems: 'center', minHeight: 40 }}
                >
                  <span className="save-loader" />
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
                <Alert onClick={handleRestart} color="warning" className="mt-3 mb-0 pointer">
                  Test Ended - Reset <i className="far fa-sync-alt" />
                </Alert>
              )}
            </div>
          </div>
        </div>
        <div className="no-space__break" />
        <div id="TestInputContainer" className={cn({ disabled: ended })}>
          <div className="space-between pointer" onClick={this.toggleInputOpen}>
            <span className="light-grey">{listening ? '(Listening)' : 'User Says'}</span>
            <i
              className={cn('fas fa-caret-left fa-lg light-grey rotate', {
                'fa-rotate--90': inputOpen,
              })}
            />
          </div>
          <Collapse isOpen={inputOpen}>
            <div id="TestInput">
              <Textarea
                className="editor"
                placeholder="Enter response"
                value={input}
                onChange={(e) => !ended && this.setInput(e.target.value)}
                onKeyDown={this.onKeydown}
              />
              <small className="text-muted ml-1">Enter to send</small>
            </div>
          </Collapse>
        </div>
      </div>
    );
  }
}

// { listening ?
//   <span className='text-muted'>{finalTranscript} <span className="text-danger">{interimTranscript}</span></span>:
// { this.state.speechSupport ?
//   <Tooltip
//     title='Hold Mic or Spacebar for voice input'
//     position='bottom'
//     disabled={this.state.listening}
//   >
//     <i
//       className={cn("fas fa-microphone px-2 py-1 pointer", {
//         'text-danger': this.state.listening,
//         'text-dull': !this.state.listening,
//       })}
//       onMouseDown={this.listenClick}
//     />
//   </Tooltip> :
//   <Tooltip
//     theme='warning'
//     title='Microphone not enabled for voice input'
//     position='bottom'
//   >
//     <i className="text-dull fas fa-microphone-slash px-2 py-1"/>
//   </Tooltip>
// }

export default SpeechRecognition({ autoStart: false })(TestBox);
