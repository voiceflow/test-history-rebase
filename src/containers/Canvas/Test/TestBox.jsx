import React from 'react'
import { Alert, Form, Input } from 'reactstrap'

import Button from 'components/Button'
import SpeakBox from './SpeakBox'

const TestBox = props => {
    const {
        time,
        input,
        outputs,
        debug,
        ended,
        pause,
        history,
        enterFlow,
        lastNode,
        setLastNode,
        resetTest,
        diagramEngine,
        handleChange,
        inputSubmit,
        audioPlayer,
        handleRestart,
    } = props

    const onKeydown = e => {
        if (e.keyCode === 13 && ! e.shiftKey) {
            inputSubmit(e)
        }
    }

    return (
        <React.Fragment>
            <div className="chatbox px-3">
            <div className="chats">
                {outputs.map((chat, i) => {
                if(chat.self){
                    return <div className="mt-2 text-right" key={i}>
                    <div className="self-message message border rounded p-2 align-self-start">
                        <p className="mb-0 px-1 text-left">{chat.self}<br/><small className="text-muted">{chat.time}</small></p>
                    </div>
                    <img src='/user_reply.svg' height={15} width={15} alt="user" className="ml-2"/>
                    </div>
                } else if (chat.diagram) {
                    return <SpeakBox
                        key={i}
                        isFlow
                        lastNode={lastNode}
                        setLastNode={setLastNode}
                        resetTest={resetTest}
                        isLast={chat.isLast}
                        diagram={chat.diagram}
                        history={history}
                        node={chat.node}
                        enterFlow={enterFlow}
                        delay={chat.delay}
                        diagramEngine={diagramEngine}
                    />
                } else if (chat.options) {
                    return <SpeakBox
                        key={i}
                        isRight
                        isChoice
                        lastNode={lastNode}
                        setLastNode={setLastNode}
                        chat={chat}
                        resetTest={resetTest}
                        isLast={chat.isLast}
                        time={time}
                        node={chat.node}
                        delay={chat.delay}
                        inputSubmit={inputSubmit}
                        diagramEngine={diagramEngine}
                    />
                }else if(chat.debug){
                    if (!debug) {
                    return null
                    } else {
                    return <div className="mt-2 text-left" key={i}>
                        <div className="message border rounded p-2 align-self-start debug">
                        <div className="mb-0 px-1 text-left">
                            <small>{chat.debug}</small>
                            <pre className="mb-2">
                            {chat.text}
                            </pre>
                        </div>
                        </div>
                    </div>
                    }
                }else if(chat.text){
                    return <SpeakBox
                        key={i}
                        isLeft
                        isSpeak
                        text={chat.text}
                        lastNode={lastNode}
                        setLastNode={setLastNode}
                        resetTest={resetTest}
                        time={time}
                        type={chat.audioType}
                        isLast={chat.isLast}
                        delay={chat.delay}
                        node={chat.node}
                        audio={chat.audio}
                        diagramEngine={diagramEngine}
                    />
                } else if (chat.isLast) {
                    return <SpeakBox
                        key={i}
                        isLast={chat.isLast}
                        lastNode={lastNode}
                        setLastNode={setLastNode}
                        resetTest={resetTest}
                        delay={chat.delay}
                        node={chat.node}
                        diagramEngine={diagramEngine}
                    />
                }else{
                    return <div className="mt-2 text-left" key={i}>
                    <div className="message border rounded align-self-start">
                        <div className="message-container p-2">
                        <p className="mb-0 px-1 text-left"><span className="text-muted"><i className="fas fa-volume-up"></i></span> {chat.text}<br/><small className="text-muted">{chat.time}</small></p>
                        </div>
                        <div className="message-progress" style={{width: ((chat.currentTime/chat.duration) * 100)+"%"}}>
                        </div>
                    </div>
                    </div>
                }
                })}
            </div>
            </div>
            <div className="break" />
            {ended ? 
            <Alert onClick={handleRestart} color="warning" className="m-3">Flow Ended - Reset <i className="far fa-sync-alt"/></Alert> :
            <React.Fragment>
                {audioPlayer ?
                <div className="audioplayer-options mb-2">
                    {pause ?
                    <Button outline color='primary' onClick={()=>this.setState({intent: 'AMAZON.ResumeIntent'}, inputSubmit)}>Resume</Button> :
                    <Button outline color='primary' onClick={()=>this.setState({intent: 'AMAZON.PauseIntent'}, inputSubmit)}>Stop/Pause</Button>
                    }
                    <Button outline color='primary' onClick={()=>this.setState({intent: 'AMAZON.NextIntent'},inputSubmit)}>Next</Button>
                    <Button outline color='primary' onClick={()=>this.setState({intent: 'AMAZON.PreviousIntent'}, inputSubmit)}>Previous</Button>
                </div> 
                :
                <Form onSubmit={inputSubmit} id="user__input" className="px-3 mb-3 mt-3">
                    <span className="light-grey">User Says</span>
                    <Input className='form-bg response-input mt-3 mb-2' name="input" type="textarea" placeholder="Enter text of your command" value={input} onChange={handleChange} onKeyDown={onKeydown}/>
                    <Button isBtn isBlack isLarge onClick={(e) => inputSubmit(e)}>Send</Button>
                    <small className="text-muted pb-3 pt-2 d-block"><kbd>⌘</kbd> + Enter</small>
                </Form>
                }
            </React.Fragment>
            }
        </React.Fragment>
    )
}

export default TestBox