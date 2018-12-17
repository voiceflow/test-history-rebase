import React, { Component } from 'react'
import './Onboarding.css'

const STAGE = [
    {
        title: 'Drag in your first block!',
        desc: 'Add components to your screen by dragging and dropping from your block bar',
        video: 'https://s3.amazonaws.com/com.getvoiceflow.videos/OB-1-1.mp4'
    },{
        title: 'Connect your blocks',
        desc: 'Connect your blocks by linking the ports',
        video: 'https://s3.amazonaws.com/com.getvoiceflow.videos/OB-1-2.mp4'
    },{
        title: 'Tell Alexa what to say',
        desc: 'Type what you want Alexa to say to user',
        video: 'https://s3.amazonaws.com/com.getvoiceflow.videos/OB-1-3.mp4'
    },{
        title: 'Test on Voiceflow',
        desc: 'Quickly test changes on Voiceflow before testing on your Alexa device',
        video: 'https://s3.amazonaws.com/com.getvoiceflow.videos/OB-1-4.mp4'
    },{
        title: 'Test live on Alexa',
        desc: 'Have an Alexa device? Upload your skill to Alexa and test it live!',
        video: 'https://s3.amazonaws.com/com.getvoiceflow.videos/OB-1-5.mp4'
    },{
        title: <span>Congrats <span role="img" aria-label="party">🎉</span></span>,
        component: <React.Fragment>
            <div className="onboarding-desc">
                Here are some more resources to take your skill to the next level
            </div>
            <div className="embed-responsive embed-responsive-16by9 my-3 rounded-iframe">
                <iframe className="embed-responsive-item"
                    title="tutorial-series"
                    src="https://www.youtube.com/embed/YKbsGrEmtHI" frameBorder="0" allowFullScreen
                />
            </div>
            <a className="btn btn-secondary btn-block my-2" href="https://www.facebook.com/groups/voiceflowgroup/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook mr-2"/> Join the Community
            </a>
            <hr/>
        </React.Fragment>
    }
]

class Onboarding extends Component {

    constructor(props){
        super(props)

        this.state = {
            stage: 0
        }
    }

    componentWillUpdate(props, state){
        if(state.stage >= STAGE.length){
            localStorage.removeItem('onboarding')
            this.props.finished()
        }
    }

    render(){
        if(this.state.stage >= STAGE.length) return null

        let video = STAGE[this.state.stage].video
        let component = STAGE[this.state.stage].component

        return <div id="onboarding">
            <div className="position-relative">
                {(this.state.stage !== STAGE.length - 1) && <React.Fragment>
                    <small>{this.state.stage + 1}/{STAGE.length-1}</small>
                    <small className="top-right clickable" onClick={()=>this.setState({stage: STAGE.length})}>SKIP</small>
                </React.Fragment>}
                <h5>{STAGE[this.state.stage].title}</h5>
                {component ? component:
                    <React.Fragment>
                        {!!video && <video className="onboarding-video" autoPlay loop key={video}>
                            <source src={video}/>
                        </video>}
                        <div className="onboarding-desc">
                            {STAGE[this.state.stage].desc}
                        </div>
                    </React.Fragment>
                }
                <div className="super-center my-3">
                    {this.state.stage !== 0 && 
                        <span className="clickable mr-3" onClick={()=>this.setState({stage: this.state.stage - 1})}>
                            Previous
                        </span>
                    }
                    <button className="white-pill" onClick={()=>this.setState({stage: this.state.stage + 1})}>
                        {this.state.stage === STAGE.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    }
}

export default Onboarding