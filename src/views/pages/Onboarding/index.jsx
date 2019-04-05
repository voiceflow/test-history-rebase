import React, { Component } from 'react'
import "./onboarding.css"
import axios from 'axios'
import StepProgressBar from './../../components/StepProgressBar'
import { Form, FormGroup, Input} from 'reactstrap'
import { connect } from "react-redux";

const PROG_XP = (xp) => {
	switch(xp){
		case 'intermediate':
			return 'OKAY'
		case 'expert':
			return 'GOD'
		default:
			return 'NOOB'
	}
}

const SHOW_CALENDLY_NUMBER = 20
class Onboarding extends Component{
	constructor(props){
		super(props);

		this.state = {
			stage: null,
			company_name: '',
			company_role: '',
			company_size: '',
			type: '',
			experience: '',
			design: false,
			build: false
		}

		this.handleChange = this.handleChange.bind(this)
		this.handleSizeSelection = this.handleSizeSelection.bind(this)
		this.handleIndustrySelection = this.handleIndustrySelection.bind(this)
		// this.trackOnboardingPage = this.trackOnboardingPage.bind(this)
		this.renderModalContent = this.renderModalContent.bind(this)
		this.submitSurvey = this.submitSurvey.bind(this)
		this.closeSurvey = this.closeSurvey.bind(this)
	}

	closeSurvey(){
		this.props.history.push('/')
	}

	handleChange(event){
        this.setState({
            saved: false,
            [event.target.name]: event.target.value
        });
    }

    submitSurvey(prog_xp){
			var s = this.state;
			axios.post('/onboard', {
				usage_type: s.type,
				programming: s.experience,
				company_name: s.company_name,
				company_role: s.company_role,
				company_size: s.company_size,
				purpose: s.purpose,
				design: s.design,
				build: s.build
			})
			.then(res => {
				localStorage.setItem('onboarding', PROG_XP(s.experience))
				this.props.history.push("/templates");
			})
			.catch(err => {
				localStorage.setItem('onboarding', PROG_XP(s.experience))
				this.props.history.push("/templates");
			})
    }

    handleSizeSelection(value) {
		this.setState({
            saved: false,
           	company_size: value
        });
	}

	handleIndustrySelection(value) {
		this.setState({
            saved: false,
           	industry: value
        });
	}

	componentDidMount() {
    let pictures = [
      '/beginner-unselected.png', 
      '/little-unselected.png', 
      '/alot-unselected.png',
      '/design-unselected.png',
      '/publish-unselected.png',
      '/unselected.png',
      '/unselected-2.png'
    ]
    pictures.forEach((picture) => {
      const img = new Image();
      img.src = picture.fileName;
    })
		// this.trackOnboardingPage('Initial Page')
	}

	componentWillUnmount() {
		// Delete calendly script
		const calendly_script = document.getElementById('calendly-script')
		if(calendly_script !== null){
			calendly_script.parentNode.removeChild(calendly_script)
		}
	}

	// trackOnboardingPage(page) {
	// 	axios.post('/analytics/track_onboarding', {page: page})
	// 	.catch((err) => {

	// 	})
	// }
	
	renderModalContent(){
		switch (this.state.stage){
			case 'calendly':
				const head = document.querySelector('head')
				const script = document.createElement('script')
				script.id = 'calendly-script'
				script.setAttribute('src',  'https://assets.calendly.com/assets/external/widget.js')
				head.appendChild(script)

				return <React.Fragment key={this.state.stage}>
					<StepProgressBar num_stages={6} stage={5} classes={"onboarding-progress"}/>
					<div className="calendly-outer">
						<div className="calendly-inline-widget" id="calendly" data-url="https://calendly.com/voiceflow"/>
					</div>

					<button id="submit-calendly" className="purple-btn" onClick={this.submitSurvey}>Complete</button>
				</React.Fragment>
			case 'purpose_stage':
				return <React.Fragment key={this.state.stage}>
					<StepProgressBar num_stages={6} stage={(this.state.company_size >= SHOW_CALENDLY_NUMBER ? 4: 5)} classes={"onboarding-progress"}/>
						<p className="modal-bg-txt text-center mb-5 mt-4">What best describes you?</p>
						<div className="row justify-content-center mb-3">
							<button className={(this.state.purpose === 'EXPLORING' ? "btn-info-onboarding-selected": "btn-info-onboarding")} onClick={() => {this.setState({purpose: 'EXPLORING'})}}>I'm interested in voice and want to explore</button>
						</div>
						<div className="row justify-content-center mb-5">
							<button className={(this.state.purpose === 'IDEA' ? "btn-info-onboarding-selected": "btn-info-onboarding")} onClick={() => {this.setState({purpose: 'IDEA'})}}>I have an idea and want to build it</button>
						</div>
						<div className="justify-content-center">
							<button className={"purple-btn" + (!['EXPLORING', 'IDEA'].includes(this.state.purpose) ? ' disabled': '')} disabled={!['EXPLORING', 'IDEA'].includes(this.state.purpose)} onClick={() => {
								if(this.state.company_size >= SHOW_CALENDLY_NUMBER){
									this.setState({stage: 'calendly'})
								} else {
									this.submitSurvey()
								}
							}}>{this.state.company_size >= SHOW_CALENDLY_NUMBER ? 'Next Question' : 'Complete'}</button>
						</div>
					</React.Fragment>
			case 'code_stage':
				return <React.Fragment key={this.state.stage}>
					<StepProgressBar num_stages={6} stage={(this.state.type === 'PERSONAL'? 4: 3)} classes={"onboarding-progress"}/>
					<p className="modal-bg-txt text-center mb-5 mt-4">How much experience do you have coding?</p>
					<div className="row justify-content-center mb-3">
						<div className="col-s mr-4">
							<button className="void-button mb-2" onClick={() => {this.setState({experience: 'beginner'})}}><img className="image-selector" alt="beginner" src={this.state.experience === 'beginner' ? "/beginner-selected.png" : "/beginner-unselected.png"}/></button>
							<p className={this.state.experience === 'beginner' ? "" : "text-muted"}>None</p>
						</div>
						<div className="col-s ml-4 mr-4">
							<button className="void-button mb-2" onClick={() => {this.setState({experience: 'intermediate'})}}><img className="image-selector" alt="intermediate" src={this.state.experience === 'intermediate' ? "/little-selected.png" : "/little-unselected.png"}/></button>
							<p className={this.state.experience === 'intermediate' ? "" : "text-muted"}>A little</p>
						</div>
						<div className="col-s ml-4">
							<button className="void-button mb-2" onClick={() => {this.setState({experience: 'expert'})}}><img className="image-selector" alt="alot" src={this.state.experience === 'expert' ? "/alot-selected.png" : "/alot-unselected.png"}/></button>
							<p className={this.state.experience === 'expert' ? "" : "text-muted"}>A lot</p>
						</div>
					</div>
					<div className="justify-content-center">
						<button className={"purple-btn" + (!(['beginner', 'intermediate', 'expert'].includes(this.state.experience)) ? ' disabled': '')} disabled={!(['beginner', 'intermediate', 'expert'].includes(this.state.experience))} onClick={() => {
							this.setState({stage: 'purpose_stage'})
						}}>Next Question</button>
					</div>
				</React.Fragment>
			case 'work_plan':
				return <React.Fragment key={this.state.stage}>
					<StepProgressBar num_stages={6} stage={(this.state.type === 'PERSONAL'? 3: 2)} classes={"onboarding-progress"}/>
					<p className="modal-bg-txt text-center mb-5 mt-4">What do you plan to use Voiceflow for?</p>
					<div className="row justify-content-center mb-3">
						<div className="col-s mr-4">
							<button className="void-button mt-2 mb-2" onClick={() => {this.setState(prev_state => ({design: !prev_state.design}))}}><img id="design-2" alt="design" src={this.state.design ? "/design-selected.png" : "/design-unselected.png"}/></button>
							<p className={this.state.design ? "" : "text-muted"}>Design & Prototype</p>
						</div>
						<div className="col-s ml-4">
							<button className="void-button mb-2" onClick={() => {this.setState(prev_state => ({build: !prev_state.build}))}}><img id="design" alt="publish" src={this.state.build ? "/publish-selected.png" : "/publish-unselected.png"}/></button>
							<p className={this.state.build ? "" : "text-muted"}>Build & Publish</p>
						</div>
					</div>
					<div className="justify-content-center">
						<button className={"purple-btn" + (!(this.state.design || this.state.build) ? ' disabled': '')} disabled={!(this.state.design || this.state.build) } onClick={() => {this.setState({stage: 'code_stage'})}}>Next Question</button>
					</div>
				</React.Fragment>
			case 'work_name':
				return <React.Fragment key={this.state.stage}>
					<StepProgressBar num_stages={6} stage={1} classes={"onboarding-progress"}/>
					<p className="modal-bg-txt text-center mb-4 mt-4">Tell us more about your company</p>
					<div className="d-flex justify-content-center mb-3">
						<Form className="w-100">
							<FormGroup>
								<Input className="form-bg" name="company_name" onChange={this.handleChange} placeholder="Company name" value={this.state.company_name}/>
							</FormGroup>
							<FormGroup>
								<Input className="form-bg" name="company_role" onChange={this.handleChange} placeholder="Role" value={this.state.company_role}/>
							</FormGroup>
							<FormGroup>
								<Input className="form-bg" type="number" name="company_size" onChange={this.handleChange} placeholder="Number of Employees" value={this.state.company_size}/>
							</FormGroup>
						</Form>
					</div>
					<div className="justify-content-center">
						<button 
							className={"purple-btn" + (!(!!this.state.company_name && !!this.state.company_role && parseInt(this.state.company_size) > 0) ? ' disabled': '')} 
							disabled={!(!!this.state.company_name && !!this.state.company_role && parseInt(this.state.company_size) > 0)} 
							onClick={() => {this.setState({stage: 'work_plan'})}}>
							Next Question
						</button>
					</div>
				</React.Fragment>
			case 'work_type':
				return <React.Fragment key={this.state.stage}>
					<StepProgressBar num_stages={6} stage={0} classes={"onboarding-progress"}/>
					<p className="modal-bg-txt text-center mb-5 mt-4">Are you using Voiceflow for work?</p>
					<div className="row justify-content-center mb-3">
						<div className="col-s mr-4">
							<button className="void-button mb-2" onClick={() => {this.setState({type: "PERSONAL"})}}><img id="design" alt="selected" src={this.state.type === 'PERSONAL' ? "/selected.png" : "/unselected.png"}/></button>
							<p className={this.state.type === 'PERSONAL' ? "" : "text-muted"}>Personal</p>
						</div>
						<div className="col-s ml-4">
							<button className="void-button mb-2" onClick={() => {this.setState({type: "WORK"})}}><img id="design" alt="work" src={this.state.type === 'WORK' ? "/selected-2.png" : "/unselected-2.png"}/></button>
							<p className={this.state.type === 'WORK' ? "" : "text-muted"}>Work</p>
						</div>
					</div>
					<div className="justify-content-center">
						<button className={"purple-btn" + (!['WORK', 'PERSONAL'].includes(this.state.type) ? ' disabled': '')} disabled={!['WORK', 'PERSONAL'].includes(this.state.type)} onClick={() => {
							if(this.state.type === 'WORK'){
								this.setState({stage: 'work_name'})
							} else if(this.state.type === 'PERSONAL'){
								this.setState({stage: 'work_plan'})
							}	
						}}>Next Question</button>
					</div>
				</React.Fragment>
			default:
				return <React.Fragment key={this.state.stage}>
					<img className='logo mb-3' src={process.env.PUBLIC_URL+'/logo.svg'} alt='logo' 
						height="25"
					/>
					<p className="modal-bg-txt text-center mb-3">Hi, {this.props.user.name}</p>
					<p className="onboarding-modal-txt text-center mb-2">You just joined the worlds biggest community of VUI designer and developers building voice apps. We have a few questions to personalize your experience!</p>
					<p className="onboarding-modal-txt text-center mb-4">- Voiceflow team <span role="img" aria-label="Heart">❤️</span></p>
					<div className="justify-content-center">
						<button className="purple-btn" onClick={() => {this.setState({stage: 'work_type'})}}>Continue</button>
					</div>
				</React.Fragment>
		}
	}

	render(){
		return(
			<div className="scuffed pt-4 pb-4 h-100">
				<div className="onboarding-page">
						<div className="d-flex h-100 justify-content-center text-center onboarding-survey">
							<div className="align-self-center">
								{/* {this.state.stage !== 'calendly' && <button className="exit-survey close" onClick={this.closeSurvey}>x</button>} */}
								<span className="onboarding-title">WELCOME SURVEY</span>
								{this.renderModalContent()}
							</div>
						</div>
				</div>
			</div>

		)
	}	
}

const mapStateToProps = state => ({
  user: state.account
})

export default connect(mapStateToProps)(Onboarding);
