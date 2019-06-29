import React, { useRef, useState } from 'react';
import { Alert, Form, Input } from 'reactstrap';

import SpeakBox from './SpeakBox';

const TestBox = (props) => {
  const containerRef = useRef(null);
  const { outputs, ended, enterFlow, resetTest, diagramEngine, setAudio, inputSubmit, handleRestart } = props;

  const [input, setInput] = useState('');

  const submit = (value) => {
    setInput('');
    inputSubmit(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submit(input);
    return false;
  };

  const onKeydown = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const isOverflow = containerRef.current && containerRef.current.scrollTop !== 0;

  return (
    <div className="dialog">
      <div className="chat-container" style={isOverflow ? { borderTop: '1px solid #8da2b545' } : null}>
        <div ref={containerRef} className="chatbox px-3">
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
              return (
                <SpeakBox
                  key={i}
                  chat={chat}
                  setAudio={setAudio}
                  resetTest={resetTest}
                  node={chat.node}
                  enterFlow={enterFlow}
                  submit={submit}
                  diagramEngine={diagramEngine}
                />
              );
            })}
          </div>
        </div>
      </div>
      {ended ? (
        <Alert onClick={handleRestart} color="warning" className="m-3">
          Flow Ended - Reset <i className="far fa-sync-alt" />
        </Alert>
      ) : (
        <>
          <div className="no-space__break" />
          <Form onSubmit={handleSubmit} id="user__input" className="px-3 mb-3 mt-3">
            <span className="light-grey">User Says</span>
            <Input
              className="form-bg response-input mt-3 mb-2 pt-2"
              name="input"
              type="textarea"
              placeholder="Enter response"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeydown}
            />
            <small className="float-left text-muted pb-3 pl-1 pt-1 d-block">Enter to send</small>
          </Form>
        </>
      )}
    </div>
  );
};

export default TestBox;
