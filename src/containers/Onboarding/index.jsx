import './onboarding.css';

import axios from 'axios';
import cn from 'classnames';
import React, { Component } from 'react';
import Select from 'react-select';
import { Form, FormGroup, Input } from 'reactstrap';

import Button from '@/components/Button';
import { Spinner } from '@/components/Spinner';
import StepProgressBar from '@/components/StepProgressBar/StepProgressBar';
import { ButtonCard } from '@/containers/Onboarding/container';
import { userSelector } from '@/ducks/account';
import { connect } from '@/hocs';

const CLASS_MUTED = 'text-muted';
const PROG_XP = (xp) => {
  switch (xp) {
    case 'intermediate':
      return 'OKAY';
    case 'expert':
      return 'GOD';
    default:
      return 'NOOB';
  }
};

const user_roles = [
  { value: 'designer', label: 'Designer' },
  { value: 'developer', label: 'Developer' },
  { value: 'product', label: 'Product' },
  { value: 'others', label: 'Other' },
];

const selectStyle = {
  option: (provided) => ({
    ...provided,
    textAlign: 'left',
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '2px 15px',
  }),
  control: (provided) => ({
    ...provided,
    height: '45px',
  }),
};

const SHOW_CALENDLY_NUMBER = 20;
class Onboarding extends Component {
  constructor(props) {
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
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSizeSelection = this.handleSizeSelection.bind(this);
    this.handleIndustrySelection = this.handleIndustrySelection.bind(this);
    // this.trackOnboardingPage = this.trackOnboardingPage.bind(this)
    this.renderModalContent = this.renderModalContent.bind(this);
    this.submitSurvey = this.submitSurvey.bind(this);
    this.closeSurvey = this.closeSurvey.bind(this);
  }

  closeSurvey() {
    const { history } = this.props;
    history.push('/');
  }

  handleChange(event) {
    this.setState({
      saved: false,
      [event.target.name]: event.target.value,
    });
  }

  createSkill = () => {
    const { templates } = this.state;
    const { history, team_id } = this.props;
    // Onboarding Failsafe
    if (!Array.isArray(templates) || !templates[0] || !templates[0].module_id) {
      return history.push('/dashboard');
    }

    const module_id = templates[0].module_id;
    axios
      .post(`/team/${team_id}/copy/module/${module_id}`, {
        name: 'My First Project',
        locales: ['en-US'],
        platform: 'alexa',
      })
      .then((res) => {
        if (res.data.skill_id && res.data.diagram) {
          setTimeout(() => {
            history.push(`/canvas/${res.data.skill_id}/${res.data.diagram}`);
          }, 3000);
        } else {
          throw new Error('Invalid Response Format');
        }
      })
      .catch((err) => {
        console.error(err);
        alert('unable to create skill');
      });
  };

  loadDefaultTemplates = () => {
    axios
      .get('/template/all')
      .then((res) => {
        if (Array.isArray(res.data)) {
          this.setState({
            templates: res.data,
          });
          // preload images for performance
          this.images = [];
          res.data.forEach((template, i) => {
            this.images[i] = new Image();
            this.images[i].src = template.module_icon;
          });
        } else {
          throw new Error('Malformed Response');
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err.response);
        alert('Unable to Retrieve Templates');
      });
  };

  submitSurvey() {
    const s = this.state;
    this.setState({
      loading: true,
    });
    axios
      .post('/onboard', {
        usage_type: s.type,
        programming: s.experience,
        company_name: s.company_name,
        company_role: s.company_role,
        company_size: s.company_size,
        new_company_role: s.new_company_role,
        purpose: s.purpose,
        design: s.design,
        build: s.build,
      })
      .then(() => {
        localStorage.setItem('onboarding', PROG_XP(s.experience));
        this.createSkill();
      })
      .catch(() => {
        localStorage.setItem('onboarding', PROG_XP(s.experience));
        this.createSkill();
      });
  }

  handleSizeSelection(value) {
    this.setState({
      saved: false,
      company_size: value,
    });
  }

  handleIndustrySelection(value) {
    this.setState({
      saved: false,
      industry: value,
    });
  }

  componentDidMount() {
    // preload images
    const pictures = [
      '/beginner-unselected.png',
      '/little-unselected.png',
      '/alot-unselected.png',
      '/design-unselected.png',
      '/publish-unselected.png',
      '/unselected.png',
      '/unselected-2.png',
    ];
    pictures.forEach((picture) => {
      const img = new Image();
      img.src = picture;
    });

    this.loadDefaultTemplates();
  }

  // eslint-disable-next-line class-methods-use-this
  componentWillUnmount() {
    // Delete calendly script
    const calendly_script = document.getElementById('calendly-script');
    if (calendly_script !== null) {
      calendly_script.parentNode.removeChild(calendly_script);
    }
  }

  renderModalContent() {
    const { loading, stage, experience, design, company_name, company_role, company_size, type, build, new_company_role } = this.state;
    const { user } = this.props;

    if (loading) {
      return <Spinner message="Creating Project" transparent />;
    }

    switch (stage) {
      case 'calendly':
        /* eslint-disable no-case-declarations */
        const head = document.querySelector('head');
        const script = document.createElement('script');
        /* eslint-enable no-case-declarations */

        script.id = 'calendly-script';
        script.setAttribute('src', 'https://assets.calendly.com/assets/external/widget.js');
        head.appendChild(script);

        return (
          <React.Fragment key={stage}>
            <StepProgressBar num_stages={3} stage={2} classes="onboarding-progress" />
            <div className="calendly-outer mt-3">
              <div className="calendly-inline-widget" id="calendly" data-url="https://calendly.com/voiceflow" />
            </div>
            <Button isPrimary id="submit-calendly" onClick={this.submitSurvey}>
              Complete
            </Button>
          </React.Fragment>
        );
      case 'code_stage':
        return (
          <div key={stage} className="pb-5 mb-5">
            <StepProgressBar num_stages={3} stage={2} classes="onboarding-progress" />
            <label className="modal-bg-txt text-center mb-3 mt-4">How much experience do you have coding?</label>
            <div className="row justify-content-center mb-4">
              <ButtonCard
                onClick={() => {
                  this.setState({ experience: 'beginner' });
                }}
              >
                <img
                  className="image-selector"
                  alt="beginner"
                  src={experience === 'beginner' ? '/beginner-selected.png' : '/beginner-unselected.png'}
                />
                <p className={experience === 'beginner' ? '' : CLASS_MUTED}>None</p>
              </ButtonCard>
              <ButtonCard
                onClick={() => {
                  this.setState({ experience: 'intermediate' });
                }}
              >
                <img
                  className="image-selector"
                  alt="intermediate"
                  src={experience === 'intermediate' ? '/little-selected.png' : '/little-unselected.png'}
                />
                <p className={experience === 'intermediate' ? '' : CLASS_MUTED}>A Little</p>
              </ButtonCard>
              <ButtonCard
                onClick={() => {
                  this.setState({ experience: 'expert' });
                }}
              >
                <img className="image-selector" alt="alot" src={experience === 'expert' ? '/alot-selected.png' : '/alot-unselected.png'} />
                <p className={experience === 'expert' ? '' : CLASS_MUTED}>A Lot</p>
              </ButtonCard>
            </div>
            <Button isPrimary isTransparent disabled={!['beginner', 'intermediate', 'expert'].includes(experience)} onClick={this.submitSurvey}>
              Complete
            </Button>
          </div>
        );
      case 'work_plan':
        return (
          <div key={stage} className="pb-5 mb-5">
            <StepProgressBar num_stages={3} stage={1} classes="onboarding-progress" />
            <label className="modal-bg-txt text-center mb-3 mt-4">What do you plan to use Voiceflow for?</label>
            <div className="row justify-content-center mb-4">
              <ButtonCard
                onClick={() => {
                  this.setState((prev_state) => ({ design: !prev_state.design }));
                }}
              >
                <img id="design-2" alt="design" src={design ? '/blank.svg' : '/blank_inactive.svg'} />
                <p className={design ? '' : CLASS_MUTED}>Design & Prototype</p>
              </ButtonCard>
              <ButtonCard
                onClick={() => {
                  this.setState((prev_state) => ({ build: !prev_state.build }));
                }}
              >
                <img id="design" alt="publish" src={build ? '/build.svg' : '/build_inactive.svg'} />
                <p className={build ? '' : CLASS_MUTED}>Build & Publish</p>
              </ButtonCard>
            </div>
            <Button isPrimary disabled={!(design || build)} onClick={() => this.setState({ stage: 'code_stage' })}>
              Continue
            </Button>
            <p className="small text-dull mt-3">Select all that apply</p>
          </div>
        );
      case 'work_name':
        return (
          <div key={stage} className="pb-5 mb-5">
            <StepProgressBar num_stages={3} stage={1} classes="onboarding-progress" />
            <label className="modal-bg-txt text-center mb-3 mt-4">Tell us more about your company</label>
            <div className="d-flex justify-content-center mb-3">
              <Form className="w-100">
                <FormGroup>
                  <Input className="form-bg" name="company_name" onChange={this.handleChange} placeholder="Company Name" value={company_name} />
                </FormGroup>
                <FormGroup>
                  <Select
                    classNamePrefix="select-box"
                    onChange={(selected) => {
                      this.setState({ company_role: selected.value });
                    }}
                    placeholder="Your Role"
                    options={user_roles}
                    styles={selectStyle}
                  />
                </FormGroup>
                {company_role === 'others' && (
                  <FormGroup>
                    <Input
                      className="form-bg"
                      name="new_company_role"
                      onChange={this.handleChange}
                      placeholder="Your Role"
                      value={new_company_role}
                    />
                  </FormGroup>
                )}
                <FormGroup>
                  <Input
                    className="form-bg"
                    type="number"
                    name="company_size"
                    onChange={this.handleChange}
                    placeholder="Number of Employees"
                    value={company_size}
                  />
                </FormGroup>
              </Form>
            </div>
            <Button
              isPrimary
              disabled={!(!!company_name && !!company_role && parseInt(company_size, 10) > 0)}
              onClick={() => {
                if (company_size >= SHOW_CALENDLY_NUMBER) {
                  this.setState({ stage: 'calendly' });
                } else {
                  this.submitSurvey();
                }
              }}
            >
              Continue
            </Button>
          </div>
        );
      case 'work_type':
        return (
          <div key={stage} className="pb-5 mb-5">
            <StepProgressBar num_stages={3} stage={0} classes="onboarding-progress" />
            <label className="modal-bg-txt text-center mb-3">Who will use Voiceflow?</label>
            <div className="row justify-content-center mb-4">
              <ButtonCard
                onClick={() => {
                  this.setState({ type: 'PERSONAL' });
                }}
              >
                <img alt="selected" src={type === 'PERSONAL' ? '/images/icons/solo-active.svg' : '/images/icons/solo.svg'} />
                <p
                  className={cn({
                    CLASS_MUTED: type !== 'PERSONAL',
                  })}
                >
                  Just Me
                </p>
              </ButtonCard>

              <ButtonCard
                onClick={() => {
                  this.setState({ type: 'WORK' });
                }}
              >
                <img alt="work" src={type === 'WORK' ? '/images/icons/collaborate-selected.svg' : '/images/icons/collaborate.svg'} />
                <p
                  className={cn({
                    CLASS_MUTED: type !== 'WORK',
                  })}
                >
                  My Team
                </p>
              </ButtonCard>
            </div>
            <Button
              isPrimary
              disabled={!['WORK', 'PERSONAL'].includes(type)}
              onClick={() => {
                if (type === 'WORK') {
                  this.setState({ stage: 'work_name' });
                } else if (type === 'PERSONAL') {
                  this.setState({ stage: 'work_plan' });
                }
              }}
            >
              Continue
            </Button>
          </div>
        );
      default:
        return (
          <div key={stage} className="pb-5 mb-5">
            <div className="text-center">
              <label className="modal-bg-txt dark text-center mb-3">Hi, {user.name}</label>
              <p className="onboarding-modal-txt text-muted text-center mb-2">
                You just joined the worlds biggest community of designers and developers building for voice. We have a few questions to personalize
                your experience!
              </p>
              <p className="onboarding-modal-txt text-muted text-center mb-5">
                - Voiceflow team{' '}
                <span role="img" aria-label="Heart">
                  ❤️
                </span>
              </p>
              <div className="justify-content-center">
                <Button
                  isPrimary
                  onClick={() => {
                    this.setState({ stage: 'work_type' });
                  }}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        );
    }
  }

  render() {
    return (
      <div id="template-box-container">
        <div className="card super-center flex-column text-center">
          <div className="uppercase-header">WELCOME SURVEY</div>
          <div className="flex-grow-1 super-center">{this.renderModalContent()}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = {
  user: userSelector,
};

export default connect(mapStateToProps)(Onboarding);
