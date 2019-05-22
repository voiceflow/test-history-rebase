import React from 'react'
import { Alert, Form, Input, InputGroupAddon, InputGroup } from 'reactstrap'

import Button from 'components/Button'

const TestBox = props => {
    const {
        input,
        inputs,
        debug,
        ended,
        pause,
        onKeydown,
        handleChange,
        inputSubmit,
        audioPlayer,
        handleRestart,
    } = props

    return (
        <React.Fragment>
            <div className="chatbox px-3">
            <div className="chats">
                {inputs.map((chat, i) => {
                if(chat.self){
                    return <div className="mt-2 text-right" key={i}>
                    <div className="self-message message border rounded p-2 align-self-start">
                        <p className="mb-0 px-1 text-left">{chat.self}<br/><small className="text-muted">{chat.time}</small></p>
                    </div>
                    </div>
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
                    return <div className="mt-2 text-left" key={i}>
                    <div className="message border rounded p-2 align-self-start">
                        <p className="mb-0 px-1 text-left">{chat.text}<br/><small className="text-muted">{chat.time}</small></p>
                    </div>
                    </div>
                }else{
                    return <div className="mt-2 text-left" key={i}>
                    <div className="message border rounded align-self-start">
                        <div className="message-container p-2">
                        <p className="mb-0 px-1 text-left"><span className="text-muted"><i className="fas fa-volume-up"></i></span> {chat.src}<br/><small className="text-muted">{chat.time}</small></p>
                        </div>
                        <div className="message-progress" style={{width: ((chat.currentTime/chat.duration) * 100)+"%"}}>
                        </div>
                    </div>
                    </div>
                }
                })}
            </div>
            </div>
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
                <Form onSubmit={inputSubmit} className="px-3 mb-3">
                    <InputGroup>
                    <Input className='form-bg form-control' name="input" type="text" placeholder="response" value={input} onChange={handleChange} onKeyDown={onKeydown}/>
                    <InputGroupAddon addonType="append"><Button color="primary btn-thicc" type="submit"><i className="fas fa-bullhorn"></i></Button></InputGroupAddon>
                    </InputGroup>
                </Form>
                }
            </React.Fragment>
            }
        </React.Fragment>
    )
}

export default TestBox