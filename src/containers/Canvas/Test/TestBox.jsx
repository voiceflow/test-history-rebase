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
                    return <SpeakBox
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