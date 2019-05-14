import cn from 'classnames'
import React, { Component } from 'react'
import axios from 'axios/index'
import { connect } from "react-redux";
import { Form, FormGroup, Input } from 'reactstrap'
import Select from 'react-select'

import Button from 'components/Button'
import StepProgressBar from 'components/StepProgressBar/StepProgressBar'
import { Spinner } from 'components/Spinner/Spinner'

import "./onboarding.css"

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

const user_roles = [
	{value: 'designer', label: 'Designer'},
	{ value: 'developer', label: 'Developer' },
	{value: 'product', label: 'Product'},
	{value: 'others', label: 'Other'},
]

const selectStyle =  {
	option: (provided) => ({
		...provided,
		textAlign: 'left',
	}),
	control: (provided) => ({
		...provided,
		height: '45px'
	})
}

const SHOW_CALENDLY_NUMBER = 20
class Onboarding extends Component{
	constructor(props){
		super(props);

		this.state = {
			stage: null,
			company_name: '',
			company_role: '',
			new_company_role: '',
			company_size: '',
			type: '',
			experience: '',
			templates: [],
			design: false,
			build: false,
      loading: false,
      check: true,
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

	createSkill = () => {
    // Onboarding Failsafe
    if(!Array.isArray(this.state.templates) || !this.state.templates[0] || !this.state.templates[0].module_id){
      return this.props.history.push('/dashboard')
    }

    const module_id = this.state.templates[0].module_id
		axios.post(`/team/${this.props.team_id}/copy/module/${module_id}`, {
			name: 'My First Project',
			locales: ['en-US'],
			platform: 'alexa'
		})
    .then(res => {
      if (res.data.skill_id && res.data.diagram) {
        setTimeout(() => {
          this.props.history.push(`/canvas/${res.data.skill_id}/${res.data.diagram}`)
        }, 3000)
      } else {
        throw new Error('Invalid Response Format')
      }
    })
    .catch(err => {
      console.error(err)
      alert('unable to create skill')
    })
	}

	loadDefaultTemplates = () => {
		axios.get('/marketplace/initial_template')
    .then(res => {
      if (Array.isArray(res.data)) {
        this.setState({
          templates: res.data
        })
        // preload images for performance
        this.images = []
        res.data.forEach((template, i) => {
          this.images[i] = new Image()
          this.images[i].src = template.module_icon
        })
      } else {
        throw new Error('Malformed Response')
      }
    })
    .catch(err => {
      console.log(err.response)
      alert('Unable to Retrieve Templates')
    })
	}

  submitSurvey(prog_xp){
    var s = this.state;
    this.setState({
      loading: true
    })
    axios.post('/onboard', {
      usage_type: s.type,
      programming: s.experience,
      company_name: s.company_name,
      company_role: s.company_role,
      company_size: s.company_size,
      new_company_role: s.new_company_role,
      purpose: s.purpose,
      design: s.design,
      build: s.build
    })
    .then(res => {
      localStorage.setItem('onboarding', PROG_XP(s.experience))
      this.createSkill()
    })
    .catch(err => {
      localStorage.setItem('onboarding', PROG_XP(s.experience))
      this.createSkill()
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
    // preload images
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

    this.loadDefaultTemplates()
	}

	componentWillUnmount() {
		// Delete calendly script
		const calendly_script = document.getElementById('calendly-script')
		if(calendly_script !== null){
			calendly_script.parentNode.removeChild(calendly_script)
		}
	}

	renderModalContent(){
    if(this.state.loading) {
      return <Spinner message="Creating Project" transparent/>
    }
		switch (this.state.stage){
			case 'calendly':
				const head = document.querySelector('head')
				const script = document.createElement('script')
				script.id = 'calendly-script'
				script.setAttribute('src',  'https://assets.calendly.com/assets/external/widget.js')
				head.appendChild(script)

				return <React.Fragment key={this.state.stage}>
					<StepProgressBar num_stages={3} stage={2} classes={"onboarding-progress"}/>
					<div className="calendly-outer mt-3">
						<div className="calendly-inline-widget" id="calendly" data-url="https://calendly.com/voiceflow"/>
					</div>
          <Button isPrimary id="submit-calendly" onClick={this.submitSurvey}>Complete</Button>
				</React.Fragment>
			case 'code_stage':
				return <div key={this.state.stage} className="pb-5 mb-5">
					<StepProgressBar num_stages={3} stage={2} classes={"onboarding-progress"}/>
					<p className="modal-bg-txt text-center mb-5 mt-4">How much experience do you have coding?</p>
					<div className="row justify-content-center mb-3">
						<div className="col-s mr-4">
							<Button
								isTransparent
								className="mb-2"
								onClick={() => {this.setState({experience: 'beginner'})}}
							>
								<img className="image-selector" alt="beginner" src={this.state.experience === 'beginner' ? "/beginner-selected.png" : "/beginner-unselected.png"}/>
							</Button>
							<p className={this.state.experience === 'beginner' ? "" : "text-muted"}>None</p>
						</div>
						<div className="col-s ml-4 mr-4">
							<Button
								isTransparent
								className="mb-2"
								onClick={() => {this.setState({experience: 'intermediate'})}}
							>
								<img className="image-selector" alt="intermediate" src={this.state.experience === 'intermediate' ? "/little-selected.png" : "/little-unselected.png"}/>
							</Button>
							<p className={this.state.experience === 'intermediate' ? "" : "text-muted"}>A little</p>
						</div>
						<div className="col-s ml-4">
							<Button
								isTransparent
								className="mb-2"
								onClick={() => {this.setState({experience: 'expert'})}}
							>
								<img className="image-selector" alt="alot" src={this.state.experience === 'expert' ? "/alot-selected.png" : "/alot-unselected.png"}/>
							</Button>
							<p className={this.state.experience === 'expert' ? "" : "text-muted"}>A lot</p>
						</div>
					</div>
          <Button
						isTransparent
						disabled={!(['beginner', 'intermediate', 'expert'].includes(this.state.experience))}
          	onClick={this.submitSurvey}
					>
            Complete
          </Button>
				</div>
			case 'work_plan':
				return <div key={this.state.stage} className="pb-5 mb-5">
					<StepProgressBar num_stages={3} stage={1} classes={"onboarding-progress"}/>
					<p className="modal-bg-txt text-center mb-5 mt-4">What do you plan to use Voiceflow for?</p>
					<div className="row justify-content-center mb-3">
						<div className="col-s mr-4">
							<Button
								isTransparent
								className="mt-2 mb-2"
								onClick={() => {this.setState(prev_state => ({design: !prev_state.design}))}}
							>
								<img id="design-2" alt="design" src={this.state.design ? "/design-selected.png" : "/design-unselected.png"}/>
							</Button>
							<p className={this.state.design ? "" : "text-muted"}>Design & Prototype</p>
						</div>
						<div className="col-s ml-4">
							<Button
								isTransparent
								className="mb-2" onClick={() => {this.setState(prev_state => ({build: !prev_state.build}))}}
							>
								<img id="design" alt="publish" src={this.state.build ? "/publish-selected.png" : "/publish-unselected.png"}/>
							</Button>
							<p className={this.state.build ? "" : "text-muted"}>Build & Publish</p>
						</div>
					</div>
          <Button
						isPrimary
						disabled={!(this.state.design || this.state.build)}
          	onClick={() => this.setState({ stage: 'code_stage' })}
					>
            Next Step
          </Button>
				</div>
			case 'work_name':
				return <div key={this.state.stage} className="pb-5 mb-5">
					<StepProgressBar num_stages={3} stage={1} classes={"onboarding-progress"}/>
					<p className="modal-bg-txt text-center mb-4 mt-4">Tell us more about your company</p>
					<div className="d-flex justify-content-center mb-3">
						<Form className="w-100">
							<FormGroup>
								<Input className="form-bg" name="company_name" onChange={this.handleChange} placeholder="Company Name" value={this.state.company_name}/>
							</FormGroup>
							<FormGroup>
								<Select classNamePrefix="select-box" onChange={selected => {
									this.setState({company_role: selected.value})
								}}
								placeholder="Your Role"
								options={user_roles}
								styles={selectStyle}
								/>
							</FormGroup>
							{this.state.company_role === 'others' &&
								<FormGroup>
									<Input className="form-bg" name="new_company_role" onChange={this.handleChange} placeholder="Your Role" value={this.state.new_company_role} />
								</FormGroup>
							}
							<FormGroup>
								<Input className="form-bg" type="number" name="company_size" onChange={this.handleChange} placeholder="Number of Employees" value={this.state.company_size}/>
							</FormGroup>
						</Form>
					</div>
					<Button
						isPrimary
            disabled={!(!!this.state.company_name && !!this.state.company_role && parseInt(this.state.company_size) > 0)}
            onClick={() => {
              if(this.state.company_size >= SHOW_CALENDLY_NUMBER){
                this.setState({stage: 'calendly'})
              } else {
                this.submitSurvey()
              }
            }}>
            Next Step
          </Button>
				</div>
			case 'work_type':
				return <div key={this.state.stage} className="pb-5 mb-5">
					  <StepProgressBar num_stages={3} stage={0} classes={"onboarding-progress"}/>
            <p className="modal-bg-txt text-center mb-5">What are you using Voiceflow for?</p>
            <div className="row justify-content-center mb-3">
              <div className="col-s mr-4">
                <Button
									isTransparent
									className="mb-2"
									onClick={() => {this.setState({type: "PERSONAL"})}}
								>
									<img id="design" alt="selected" src={this.state.type === 'PERSONAL' ? "/selected.png" : "/unselected.png"}/>
								</Button>
                <p className={cn({
                  'text-muted': this.state.type !== 'PERSONAL'
                })}>Personal</p>
              </div>
              <div className="col-s ml-4">
                <Button
									isTransparent
									className="mb-2"
									onClick={() => {this.setState({type: "WORK"})}}
								>
									<img id="design" alt="work" src={this.state.type === 'WORK' ? "/selected-2.png" : "/unselected-2.png"}/>
								</Button>
                <p className={cn({
                  'text-muted': this.state.type !== 'WORK'
                })}>Work</p>
              </div>
            </div>
            <Button
							isPrimary
							disabled={!['WORK', 'PERSONAL'].includes(this.state.type)}
							onClick={() => {
              if(this.state.type === 'WORK'){
                this.setState({stage: 'work_name'})
              } else if(this.state.type === 'PERSONAL'){
                this.setState({stage: 'work_plan'})
              }
            	}}>Continue</Button>
				</div>
			default:
				return <div key={this.state.stage} className="pb-5 mb-5">
          <div className="text-center">
            <img className='logo mb-3' src={process.env.PUBLIC_URL+'/logo.svg'} alt='logo'
              height="25"
            />
            <p className="modal-bg-txt text-center mb-3">Hi, {this.props.user.name}</p>
            <p className="onboarding-modal-txt text-center mb-2">You just joined the worlds biggest community of VUI designer and developers building voice apps. We have a few questions to personalize your experience!</p>
            <p className="onboarding-modal-txt text-center mb-4">- Voiceflow team <span role="img" aria-label="Heart">❤️</span></p>
            <div className="justify-content-center">
              <Button isPrimary onClick={() => {this.setState({stage: 'work_type'})}}>Continue</Button>
            </div>
          </div>
				</div>
		}
	}

	render(){
		return(
			<div id="template-box-container">
				<div className="card super-center flex-column text-center">
          <div className="text-dull">WELCOME SURVEY</div>
          <div className="flex-grow-1 super-center">{this.renderModalContent()}</div>
				</div>
			</div>

		)
	}
}

const mapStateToProps = state => ({
  user: state.account
})

export default connect(mapStateToProps)(Onboarding);
