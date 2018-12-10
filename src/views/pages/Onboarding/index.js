import React, { Component } from 'react'
import { Input } from 'reactstrap'
import "./onboarding.css"
import axios from 'axios'
import company_sizes from './../../../services/CompanySize'
import industries from './../../../services/Industries'
import Select from 'react-select'

class Onboarding extends Component{
	constructor(props){
		super(props);

		this.state = {
			usage_type: "",
			company_name: "",
			role: "",
			company_size: "",
			industry: "",
			org: "",
			failed: false
		}

		this.handleChange = this.handleChange.bind(this);
		this.submitOnboardingSurvey = this.submitOnboardingSurvey.bind(this);
		this.handleSizeSelection = this.handleSizeSelection.bind(this);
		this.handleIndustrySelection = this.handleIndustrySelection.bind(this);
	}

	componentDidMount(){
		// axios.get('/onboard')
		// .then(res => {
		// 	if(res.data){
		// 		this.props.history.push('/');
		// 	}
		// })
		// .catch(err => {
		// 	console.log(err);
		// });
	}

	handleChange(event){
        this.setState({
            saved: false,
            [event.target.name]: event.target.value
        });
    }

    submitOnboardingSurvey(){
    	var s = this.state;

    	const submitSurvey = () => {
    		axios.post('/onboard', {
				usage_type: s.usage_type,
				company_name: s.company_name,
				role: s.role,
				company_size: s.company_size.label,
				industry: s.industry.label,
				org: s.org
			})
			.then(res => {
				this.props.history.push('/')
			})
			.catch(err => {
				console.log(err);
			})
    	}

    	if(s.usage_type === "WORK"){
    		if(s.company_name && s.role && s.industry && s.company_size){
    			submitSurvey();
    		} else {
    			this.setState({
    				failed: true
    			});
    		}
    	} else if(s.usage_type === "EDUCATION"){
    		if(s.org && s.role){
    			submitSurvey();
    		} else {
    			this.setState({
    				failed: true
    			});
    		}
    	} else {
    		submitSurvey();
    	}
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

	render(){
		var content;

		if(this.state.usage_type === ""){
			content = 
			<React.Fragment>
				<img className='logo mb-3 mt-3' src={process.env.PUBLIC_URL+'/logo.png'} alt='logo' 
					height="25"
				/>
		      	<p className="modal-bg-txt text-center mb-2">Hi, {this.props.user.name} 😊</p>
		      	<p className="modal-txt text-center mb-4">Help us tailor your experience. What do you plan on using Voiceflow for?</p>
		      	<div className="row justify-content-center">
		      		<button className="btn-info mr-3" onClick={() => {this.setState({usage_type: "WORK"})}}>Work</button> 
		      		<button className="btn-info mr-3" onClick={() => this.props.history.push('/')}>Personal</button> 
		      		<button className="btn-info mr-3" onClick={() => {this.setState({usage_type: "EDUCATION"})}}>Education</button> 
		      	</div>
			</React.Fragment>
		} else if(this.state.usage_type === "WORK"){
			content =
			<React.Fragment>
				<img className='logo mb-3 mt-3' src={process.env.PUBLIC_URL+'/logo.png'} alt='logo' 
					height="25"
				/>
				<p className="modal-txt text-center mb-4">Tell us a bit more about yourself to receive personalized content to help you use Voiceflow to the fullest.</p>
				{this.state.failed?
		    		<div className="alert alert-primary" role="alert">
					  	Missing required fields!
					</div>
		    		:
		    		null
		    	}
				<Input className="mb-2" type="text" name="company_name" placeholder="Company Name" value={this.state.company_name} onChange={this.handleChange}/>
				<Input className="mb-2" type="text" name="role" placeholder="Role" value={this.state.role} onChange={this.handleChange}/>
				<Select
                    className="input-select mb-2"
                    name="company_size"
                    value={this.state.company_size}
                    onChange={this.handleSizeSelection}
                    options={company_sizes}
                    placeholder="Company Size"
                />
				<Select
                    className="input-select mb-2"
                    name="industry"
                    value={this.state.industry}
                    onChange={this.handleIndustrySelection}
                    options={industries}
                    placeholder="Industry"
                />
				<button className="purple-btn mt-3" onClick={this.submitOnboardingSurvey}>Get Started</button>
			</React.Fragment>
		} else if(this.state.usage_type === "EDUCATION"){
			content =
			<React.Fragment>
				<img className='logo mb-3 mt-3' src={process.env.PUBLIC_URL+'/logo.png'} alt='logo' 
					height="25"
				/>
				<p className="modal-txt text-center mb-4">Tell us a bit more about yourself to receive personalized content to help you use Voiceflow to the fullest.</p>
				{this.state.failed?
		    		<div className="alert alert-primary" role="alert">
					  	Missing required fields!
					</div>
		    		:
		    		null
		    	}
				<Input className="mb-2" type="text" name="org" placeholder="Organization Name" value={this.state.org} onChange={this.handleChange}/>
				<Input className="mb-2" type="text" name="role" placeholder="Role" value={this.state.role} onChange={this.handleChange}/>
				<button className="purple-btn mt-3" onClick={this.submitOnboardingSurvey}>Get Started</button>
			</React.Fragment>
		}

		

		return(
			<div className="container h-100 d-flex justify-content-center onboarding-page">
			    <div className="my-auto border rounded p-4 text-center onboarding-survey">
			    	{content}
			    </div>
			</div>

		)
	}	
}

export default Onboarding;

