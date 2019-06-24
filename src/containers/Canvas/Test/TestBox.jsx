import React from 'react';
import { Alert, Form, Input } from 'reactstrap';

import SpeakBox from './SpeakBox';

const TestBox = (props) => {
  const {
    time,
    input,
    outputs,
    ended,
    history,
    enterFlow,
    lastNode,
    setLastNode,
    resetTest,
    diagramEngine,
    handleChange,
    inputSubmit,
    handleRestart,
  } = props;

  const onKeydown = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      inputSubmit(e);
    }
  };

  return (
    <React.Fragment>
      <div className="dialog">
        <div className="chat-container">
          <div className="chatbox px-3">
            <div className="chats">
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
                    isSpeak={!!chat.text}
                    isLeft={!!chat.text}
                    isFlow={!!chat.diagram}
                    isRight={!!chat.options}
                    isChoice={!!chat.options}
                    text={chat.text}
                    chat={chat}
                    lastNode={lastNode}
                    setLastNode={setLastNode}
                    resetTest={resetTest}
                    time={time}
                    self={chat.self}
                    isLast={chat.isLast}
                    type={chat.audioType}
                    audio={chat.audio}
                    diagram={chat.diagram}
                    history={history}
                    node={chat.node}
                    enterFlow={enterFlow}
                    inputSubmit={inputSubmit}
                    delay={chat.delay}
                    diagramEngine={diagramEngine}
                  />
                );
              })}
            </div>
          </div>
          <div className="no-space__break" />
        </div>
        {ended ? (
          <Alert onClick={handleRestart} color="warning" className="m-3">
            Flow Ended - Reset <i className="far fa-sync-alt" />
          </Alert>
        ) : (
          <React.Fragment>
            <Form onSubmit={inputSubmit} id="user__input" className="px-3 mb-3 mt-3">
              <span className="light-grey">User Says</span>
              <Input
                className="form-bg response-input mt-3 mb-2 pt-2"
                name="input"
                type="textarea"
                placeholder="Enter response"
                value={input}
                onChange={handleChange}
                onKeyDown={onKeydown}
              />
              <small className="float-left text-muted pb-3 pl-1 pt-2 d-block">Enter to send</small>
            </Form>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};

export default TestBox;
