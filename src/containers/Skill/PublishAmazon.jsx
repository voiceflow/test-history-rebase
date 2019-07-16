import './Skill.css';

import axios from 'axios';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Textarea from 'react-textarea-autosize';
import Toggle from 'react-toggle';
import { Alert, Button, ButtonGroup, Collapse, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody } from 'reactstrap';
import validUrl from 'valid-url';

import DefaultButton from '@/components/Button';
import AmazonLogin from '@/components/Forms/AmazonLogin';
import Multiple from '@/components/Forms/Multiple';
import GuidedSteps from '@/components/GuidedSteps';
import RadioButtons, { YES_NO_RADIO_BUTTONS } from '@/components/RadioButtons';
import Image from '@/components/Uploads/Image';
import { AmazonAccessToken } from '@/ducks/account';
import { setConfirm, setError } from '@/ducks/modal';
import { updateEntireVersion, updateSkillDB, updateVersion } from '@/ducks/version';

import { AMAZON_CATEGORIES } from '../../services/Categories';
import LOCALE_MAP from '../../services/LocaleMap';

const stage_title = {
  '-1': 'Login Failed',
  0: 'Login Developer with Amazon',
  1: 'Verifying',
  2: 'Privacy & Compliance',
  3: 'Rendering',
  4: 'Publishing',
  5: 'Developer Account',
  6: 'Checking Vendor',
  8: 'Submit For Review',
  7: 'Building and Submitting',
  9: 'Privacy & Compliance Ext.',
  10: 'Submitted for Review',
  11: 'Awaiting Review',
  12: 'Confirming Withdraw',
};

const disabled_stages = new Set([11, 12]);

class Skill extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      dropdown: false,
      stage: 1,
      publish: false,
      id_collapse: false,
      amzn_id: null,
      stage_error: null,
      validate: {},
    };
    // this.transferIcon = this.transferIcon.bind(this)
    this.privacyTop = React.createRef();
  }

  componentDidMount() {
    const { skill_id } = this.props;
    AmazonAccessToken()
      .then(() => this.setState({ stage: 2 }))
      .catch(() => this.setState({ stage: 0 }));

    axios
      .get(`/skill/${skill_id}?verbose=1&review_check=1`)
      .then((res) => {
        if (res.data.category) {
          // eslint-disable-next-line no-restricted-syntax
          for (const option of AMAZON_CATEGORIES) {
            if (option.value === res.data.category) {
              res.data.category = option;
              break;
            }
          }
        }

        if (res.data.invocations && res.data.invocations.value) {
          res.data.invocations = res.data.invocations.value;
        }

        if (!Array.isArray(res.data.invocations) || res.data.invocations.length === 0) {
          res.data.invocations = [''];
        }

        if (!res.data.keywords) {
          res.data.keywords = '';
        }

        if (res.data.review) {
          res.data.stage = 11;
        } else {
          delete res.data.stage;
        }
        res.data.privacy_policy = !_.isEmpty(res.data.privacy_policy) ? res.data.privacy_policy : '';

        // TODO: Antipattern, fix this when we do redux
        this.setState({
          loaded: true,
          ...res.data,
        });
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
      });
  }

  onRadio = (type, value) => {
    this.setState({
      [type]: value,
    });
  };

  handleError = (err, default_error) => {
    const { setError } = this.props;
    console.error(err);

    let error_message = '';
    if (_.has(err, ['response', 'data', 'message'])) {
      error_message += err.response.data.message;

      if (err.response.data.violations) {
        for (let i = 0; i < err.response.data.violations.length; i++) {
          error_message += `\n${err.response.data.violations[i].message}`;
        }
      }
    }

    this.setState({
      publish: false,
      stage: 2,
    });
    setError(_.has(err, ['response', 'data', 'message']) ? error_message : default_error);
  };

  onWithdraw = () => {
    const { amzn_id } = this.state;
    axios
      .post(`/amazon/${amzn_id}/withdraw`)
      .then(() => {
        this.setState({
          stage: 0,
          displayingConfirmWithdraw: false,
        });
      })
      .catch((err) => {
        this.handleError(err, 'Withdrawal Error');
        this.setState({
          stage: 11,
        });
      });
  };

  onDelete = () => {
    const { skill_id, history } = this.props;
    axios
      .delete(`/skill/${skill_id}`)
      .then(() => {
        history.push('/dashboard');
      })
      .catch((err) => {
        this.handleError(err, 'Deletion Error');
        this.setState({
          stage: 0,
        });
      });
  };

  onCertify = () => {
    const { skill_id } = this.props;
    const { amzn_id } = this.state;

    this.setState({
      stage: 7,
    });
    axios
      .post(`/amazon/${skill_id}/${amzn_id}/certify`)
      .then(() => {
        this.setState({
          stage: 11,
          publish: false,
        });
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.dir(err);
        let error_message = 'Certification Error \n';
        if (_.has(err, ['response', 'data', 'message'])) {
          error_message += err.response.data.message;

          if (err.response.data.violations) {
            for (let i = 0; i < err.response.data.violations.length; i++) {
              error_message += `\n${err.response.data.violations[i].message}`;
            }
          }
        }
        this.handleError(err, error_message);
      });
  };

  scrollToTop = () => {
    this.privacyTop.current.scrollIntoView(true);
  };

  onPublish = () => {
    const { project_id } = this.props;
    this.save(true, () => {
      const s = this.state;
      const category = s.category && s.category.value ? s.category.value : null;
      // let fields = ['name', 'inv_name', 'summary', 'description', 'invocations', 'small_icon', 'large_icon', 'category']
      const fields = {
        name: 'Name',
        // eslint-disable-next-line sonarjs/no-duplicate-string
        inv_name: 'Invocation Name',
        summary: 'Summary',
        description: 'Description',
        invocations: 'Invocations',
        small_icon: 'Small Icon',
        large_icon: 'Large Icon',
        category: 'Category',
      };
      let invalid_fields = Object.keys(fields).filter((field) => {
        if (field === 'invocations') {
          return !s.invocations[0];
        }
        if (field === 'category') {
          return !category;
        }
        return !s[field];
      });
      invalid_fields = _.values(invalid_fields);
      if (invalid_fields.length > 0) {
        this.setState({
          stage: 2,
          stage_error: {
            stage: 2,
            message: `Please fill all required fields before publishing. Missing fields: ${invalid_fields.join(', ')}`,
          },
        });
        this.scrollToTop();
        return;
      }
      if (!s.export) {
        this.setState({
          stage: 2,
          stage_error: {
            stage: 2,
            message: 'Please Certify Alexa Skill Import/Export in Privacy/Complicance',
          },
        });
        this.scrollToTop();
        return;
      }
      if (!s.instructions) {
        this.setState({
          stage: 2,
          stage_error: {
            stage: 2,
            message: 'Please Provide Testing Instructions',
          },
        });
        this.scrollToTop();
        return;
      }

      axios
        .post(`/project/${project_id}/render`, { platform: 'alexa' })
        .then((res) => {
          this.setState({ stage: 4 });
          const new_version_data = res.data;
          axios
            .post(`/project/${project_id}/version/${new_version_data.new_skill.skill_id}/alexa`)
            .then((res) => {
              this.setState({
                stage: 8,
                amzn_id: res.data,
              });
            })
            .catch((err) => {
              if (err.status === 403 || err.response.status === 403) {
                // No Vendor ID/Amazon Developer Account
                this.setState({
                  stage: 5,
                });
              } else {
                this.handleError(err, 'Publishing Error');
              }
            });
        })
        .catch((err) => {
          this.handleError(err, 'Rendering Error');
        });
    });
    this.setState({ stage: 3 });
  };

  checkVendor = () => {
    this.setState({ stage: 6 });

    axios
      .get('/session/vendor')
      .then(() => {
        this.setState({ stage: 2 });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ stage: 5 });
      });
  };

  componentWillUnmount() {
    const { loaded } = this.state;
    if (loaded) {
      this.save(true);
    }
  }

  validateForm = () => {
    const { setError } = this.props;

    const s = this.state;
    const split_keywords = s.keywords.split(',');
    if (s.privacy_policy && !validUrl.isUri(s.privacy_policy)) {
      setError('Privacy policy must be a url');
    } else if (s.terms_and_cond && !validUrl.isUri(s.terms_and_cond)) {
      setError('Terms and conditions must be a url');
    } else if (split_keywords.length > 30) {
      setError('Limited to 30 keywords');
    } else if (s.keywords.length - split_keywords.length + 1 > 500) {
      setError('The total length of all keywords must be less than or equal to 150');
    } else {
      this.setState({ publish: true });
    }
  };

  save = (publish = false, cb) => {
    const { setError, skill_id, updateEntireSkill } = this.props;
    const s = this.state;
    const category = s.category && s.category.value ? s.category.value : null;

    let store;

    if (publish === true) {
      store = {
        purchase: s.purchase,
        personal: s.personal,
        ads: s.ads,
        export: s.export,
        instructions: s.instructions,
      };
    }

    const properties = {
      name: s.name,
      inv_name: s.inv_name,
      summary: s.summary,
      description: s.description,
      keywords: s.keywords,
      invocations: s.invocations,
      small_icon: s.small_icon,
      large_icon: s.large_icon,
      category,
      locales: s.locales,
      copa: s.copa,
      privacy_policy: !_.isEmpty(s.privacy_policy) ? s.privacy_policy : '',
      terms_and_cond: s.terms_and_cond,
      ...store,
    };

    if (!properties.name) {
      return setError('Publish Settings not Saved: No Project Name');
    }

    axios
      .patch(`/skill/${skill_id}${publish === true ? '?publish=true' : ''}`, {
        ...properties,
        locales: JSON.stringify(properties.locales),
      })
      .then(() => {
        updateEntireSkill(properties);

        // eslint-disable-next-line callback-return
        if (typeof cb === 'function') cb();
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
        setError('Save Error, Publish Settings not Saved');
      });
  };

  handleChange = (event) => {
    const { stage } = this.state;
    if (stage !== 11) {
      this.setState({
        [event.target.name]: event.target.value,
      });
    }
  };

  handleSelection = (value) => {
    this.setState({
      category: value,
    });
  };

  toggle = () => {
    const { dropdown } = this.state;
    this.setState({
      dropdown: !dropdown,
    });
  };

  togglePublish = () => {
    const { publish } = this.state;
    this.setState({
      publish: !publish,
    });
  };

  closePublish = () => {
    const { stage } = this.state;
    if (stage === 1) {
      this.setState({
        stage: 0,
      });
    }
  };

  onLocaleBtnClick = (locale) => {
    let { locales } = this.state;

    if (locales.includes(locale)) {
      if (locales.length > 1) {
        locales = _.without(locales, locale);
      }
    } else {
      locales.push(locale);
    }

    this.setState({
      locales,
    });
  };

  checkValidStep = (stepNumber) => {
    const { small_icon, large_icon, summary, description, category, inv_name, invocations, name } = this.state;
    switch (stepNumber) {
      case 0:
        return !!(name && small_icon && large_icon);
      case 1:
        return !!(summary && description && category);
      case 2:
        return !!(inv_name && invocations[0]);
      default:
        return true;
    }
  };

  renderBlocks = () => {
    const {
      stage,
      locales,
      small_icon,
      large_icon,
      summary,
      description,
      category,
      inv_name,
      invocations,
      keywords,
      privacy_policy,
      terms_and_cond,
      copa,
      name,
    } = this.state;

    const blocks = [];
    const enterText = (
      <>
        Publish Skill
        <i className="fab fa-amazon ml-2" />
      </>
    );

    blocks.push({
      title: 'Basic Skill Info',
      content: (
        <>
          <FormGroup className="mb-4">
            <div className="mb-4">
              <Label className="publish-label">Display Name *</Label>
              <Input
                className="form-bg"
                invalid={this.state.validate.displayName}
                type="text"
                name="name"
                disabled={disabled_stages.has(stage)}
                placeholder="Storyflow - Interactive Story Adventures"
                value={name}
                onChange={this.handleChange}
              />
              <FormFeedback>Uh oh! Looks like there is an issue with your email. Please input a correct email.</FormFeedback>
            </div>
          </FormGroup>

          <div className="d-flex mb-5">
            <div style={{ width: '50%' }}>
              <Image
                className="icon-image large-icon text-center pa__icon"
                isDisabled={disabled_stages.has(stage)}
                path="/image/large_icon"
                image={large_icon}
                update={(url) => this.setState({ large_icon: url })}
                title="Large Icon *"
              />
            </div>
            <div style={{ width: '50%' }}>
              <Image
                className="icon-image small-icon text-center pa__icon"
                isDisabled={disabled_stages.has(stage)}
                path="/image/small_icon"
                image={small_icon}
                update={(url) => this.setState({ small_icon: url })}
                title="Small Icon *"
              />
            </div>
          </div>
        </>
      ),
      description: (
        <>
          <div className="publish-info">
            <p className="helper-text">
              <b>Display Name</b> is what we display for your Skill on Voiceflow/Amazon
            </p>
          </div>
          <div className="publish-info">
            <p className="helper-text">
              <b>Icons</b> are what will be displayed for your Skill in the Amazon web store.
            </p>
          </div>
        </>
      ),
    });

    blocks.push({
      title: 'Skill Description',
      content: (
        <>
          <FormGroup className="mt-0 mb-4">
            <Label className="publish-label">Summary *</Label>
            <Input
              className="form-bg"
              type="text"
              name="summary"
              disabled={disabled_stages.has(stage)}
              placeholder="One Sentence Skill Summary"
              value={summary}
              onChange={this.handleChange}
            />
          </FormGroup>

          <FormGroup className="mb-4">
            <Label className="publish-label">Description *</Label>
            <Textarea
              name="description"
              className="form-control"
              disabled={disabled_stages.has(stage)}
              value={description}
              onChange={this.handleChange}
              minRows={4}
              maxRows={4}
              placeholder="Skill Description"
              style={{ minHeight: '94px', maxHeight: '94px' }}
            />
          </FormGroup>

          <FormGroup className="mb-4">
            <Label className="publish-label">Category *</Label>
            <Select
              classNamePrefix="select-box"
              name="category"
              isDisabled={disabled_stages.has(stage)}
              value={category}
              onChange={this.handleSelection}
              options={AMAZON_CATEGORIES}
            />
          </FormGroup>

          <FormGroup className="mb-4">
            <Label className="publish-label">
              Keywords (Search Tags) <small>optional</small>
            </Label>
            <Input
              className="form-bg"
              type="text"
              name="keywords"
              disabled={disabled_stages.has(stage)}
              placeholder="Keywords (Separated By Commas) e.g. Game, Space, Adventure"
              value={keywords}
              onChange={this.handleChange}
            />
          </FormGroup>
        </>
      ),
      description: (
        <>
          <div className="publish-info">
            <p className="helper-text">
              <b>Summary</b> is a one sentence description of your amazing Skill.
            </p>
          </div>
          <div className="publish-info">
            <p className="helper-text">
              <b>Description</b> is where you can provide a more detailed explanation of your Skill.
            </p>
          </div>
          <div className="publish-info">
            <p className="helper-text">
              <b>Category</b> is the type of your Skill. This helps users find your Skill in the store.
            </p>
          </div>
          <div className="publish-info">
            <p className="helper-text">
              <b>Keywords</b> are words that will help your Skill be found when users are searching the Skill store.
            </p>
          </div>
        </>
      ),
    });

    blocks.push({
      title: 'Skill Invocation',
      content: (
        <>
          <FormGroup className="mb-4">
            <Label className="publish-label">Invocation Name *</Label>
            <Input
              className="form-bg"
              type="text"
              name="inv_name"
              disabled={disabled_stages.has(stage)}
              placeholder="Enter an invocation name that begins an interaction with your skill"
              value={inv_name}
              onChange={this.handleChange}
            />
          </FormGroup>

          <FormGroup className="mb-4">
            <Label className="publish-label">Invocations *</Label>
            <Multiple
              className="mt-0 input-group-text"
              list={invocations}
              max={3}
              prepend="Alexa,"
              update={(list) => this.setState({ invocations: list })}
              isDisabled={disabled_stages.has(stage)}
              placeholder={`open/start/launch ${name}`}
              add={
                <span>
                  <i className="fas fa-plus" /> Add Invocation
                </span>
              }
            />
          </FormGroup>
        </>
      ),
      description: (
        <>
          <div className="publish-info">
            <p className="mb-0 helper-text">
              <b>Invocation Name</b> is what users will use to open your Skill. For example, "<i>Tiny Tales</i>".
            </p>
          </div>
          <div className="publish-info">
            <p className="helper-text">
              <b>Invocations</b> are the various phrases that will open your Skill.
            </p>
          </div>
        </>
      ),
    });

    blocks.push({
      title: 'Locales',
      content: (
        <>
          <FormGroup className="mb-4 pa__locale-limited">
            <Label className="publish-label">Location(s)</Label>
            <ButtonGroup className="locale-button-group">
              {LOCALE_MAP.map((locale, i) => {
                const active = locales.includes(locale.value) ? 'active' : '';
                return (
                  <Button
                    outline
                    color="primary"
                    className={`locale-button ${active}`}
                    key={i}
                    onClick={() => {
                      this.onLocaleBtnClick(locale.value);
                    }}
                  >
                    {locale.name}
                  </Button>
                );
              })}
            </ButtonGroup>
          </FormGroup>
        </>
      ),
      description: (
        <>
          <div className="publish-info">
            <p className="helper-text">
              <b>Locale</b> determines your skill's availability. Your skill will be available in the regions you select here.
            </p>
          </div>
        </>
      ),
    });

    blocks.push({
      title: 'Privacy and Terms',
      content: (
        <>
          <FormGroup className="mb-4">
            <Label className="publish-label">Privacy Policy URL</Label>
            <Input
              className="form-bg"
              type="text"
              name="privacy_policy"
              disabled={disabled_stages.has(stage)}
              placeholder="Privacy Policy"
              value={privacy_policy}
              onChange={this.handleChange}
            />
          </FormGroup>

          <FormGroup className="mb-4">
            <div className="mb-4">
              <Label className="publish-label">Terms and Conditions URL</Label>
              <Input
                className="form-bg"
                type="text"
                name="terms_and_cond"
                disabled={disabled_stages.has(stage)}
                placeholder="Terms and Conditions"
                value={terms_and_cond}
                onChange={this.handleChange}
              />
            </div>

            <Label className="publish-label">Is this skill directed to children under the age of 13?</Label>
            <div className="d-flex">
              <u className="font-weight-bold mr-2">{copa ? 'YES' : 'NO'}</u>
              <Toggle checked={copa} icons={false} onChange={() => this.setState({ copa: !copa })} />
            </div>
          </FormGroup>
        </>
      ),
      description: (
        <>
          <div className="publish-info">
            <p className="helper-text">
              The <b>privacy policy url</b> is a link to the privacy policy your users will agree to when using your Skill.
            </p>
          </div>
          <div className="publish-info">
            <p className="helper-text">
              The <b>terms and conditions url</b> is a link to the terms and conditions your users will agree to when using your Skill.
            </p>
          </div>
          <div className="publish-info">
            <p className="helper-text">
              Please indicate if this skill is directed to children under the age of 13 (for the United States, as determined under the&nbsp;
              <a
                // eslint-disable-next-line no-secrets/no-secrets
                href="https://www.ftc.gov/tips-advice/business-center/privacy-and-security/children%27s-privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Children's Online Privacy Protection Act (COPPA)
              </a>
              )
            </p>
          </div>
        </>
      ),
    });

    return <GuidedSteps blocks={blocks} checkStep={this.checkValidStep} onFinishSteps={this.validateForm} submitText={enterText} />;
  };

  render() {
    const { stage, amzn_id, stage_error, instructions, locales, loaded, publish, live, id_collapse } = this.state;
    const { onConfirm } = this.props;
    // Success Screen
    if (stage === 10) {
      return (
        <div className="super-center h-100">
          <div className="success-page d-flex">
            <div className="success-text">
              <h1>
                Congrats!{' '}
                <span role="img" aria-label="happy">
                  ☺️
                </span>
              </h1>
              <p className="text-muted">
                Your skill has been successfully submitted for review to the Amazon Skill store. You will be updated on the status of your skill via
                email.
              </p>
              <Link to="/dashboard">
                <DefaultButton isPrimary variant="contained">
                  Dashboard
                </DefaultButton>
              </Link>
              <DefaultButton isWhite variant="contained" className="ml-3" onClick={() => this.setState({ stage: 2 })}>
                Return to Project
              </DefaultButton>
            </div>
            <img src="/images/success.svg" alt="success" />
          </div>
        </div>
      );
    }

    let content;
    const alexaDashboardUrl = `https://developer.amazon.com/alexa/console/ask/build/custom/${amzn_id}/development/en_US/dashboard`;
    if (stage === 0 || stage === -1) {
      content = (
        <div className="my-5">
          {stage === -1 ? <Alert color="danger">Login With Amazon Failed - Try Again.</Alert> : null}
          <AmazonLogin
            updateLogin={(stage) => {
              if (stage === 2) {
                this.checkVendor();
              } else {
                this.setState({ stage });
              }
            }}
          />
        </div>
      );
    } else if (stage === 1 || stage === 3 || stage === 4 || stage === 6 || stage === 7) {
      content = (
        <div>
          <h1>
            <span className="loader" />
          </h1>
          <p className="loading">{stage_title[stage]}</p>
        </div>
      );
    } else if (stage === 2) {
      content = (
        <div className="form">
          {stage_error && stage_error.stage === 2 ? <Alert color="danger">{stage_error.message}</Alert> : null}
          {[
            {
              value: 'purchase',
              text: 'Does this skill allow users to make purchases or spend real money?',
            },
            {
              value: 'personal',
              text: "Does this Alexa skill collect users' personal information?",
            },
            {
              value: 'ads',
              text: 'Does this skill contain advertising?',
            },
            {
              value: 'export',
              text:
                "This Alexa skill may be imported to and exported from the United States and all other countries and regions in which Amazon operates their program or in which you've authorized sales to end users (without the need for us to obtain any license or clearance or take any other action) and is in full compliance with all applicable laws and regulations governing imports and exports, including those applicable to software that makes use of encryption technology.",
              buttons: [
                {
                  id: true,
                  label: 'I certify',
                },
                {
                  id: false,
                  label: 'I do not certify',
                },
              ],
            },
          ].map((form, i) => {
            return (
              <div className="p-3 my-3 paper" key={i}>
                {form.text}
                <RadioButtons
                  buttons={form.buttons ? form.buttons : YES_NO_RADIO_BUTTONS}
                  checked={this.state[form.value]}
                  onChange={(val) => this.onRadio(form.value, val)}
                />
              </div>
            );
          })}
          <div className="p-3 my-3 paper">
            <Label>Testing Instructions</Label>
            <Textarea
              name="instructions"
              className="blank"
              value={instructions}
              onChange={this.handleChange}
              minRows={3}
              placeholder="Any Particular Testing Instructions for Amazon Approval Process"
            />
          </div>
          <DefaultButton isBtn isPrimary onClick={this.onPublish}>
            Submit to Alexa
          </DefaultButton>
        </div>
      );
    } else if (stage === 5) {
      content = (
        <div>
          Your Amazon Account needs to set up developer settings to Upload Skills
          <Alert className="mt-4">Press "Create your Amazon Developer account" and sign up with the same email as your Amazon Account.</Alert>
          <div className="my-3">
            <a href="https://developer.amazon.com/login.html" className="btn btn-primary mr-2" target="_blank" rel="noopener noreferrer">
              Developer Sign Up
            </a>
            <DefaultButton isClear onClick={this.checkVendor}>
              <i className="fas fa-sync-alt" /> Check Again
            </DefaultButton>
          </div>
        </div>
      );
    } else if (stage === 8) {
      content = (
        <div>
          <img src="/images/preview.svg" alt="Success" height="160" />
          <br />
          Your Skill Has been uploaded to Alexa Development!
          <span className="text-muted text-center">You may test on the Alexa Simulator or Submit your Skill for review</span>
          <div className="my-3">
            <a
              href={`https://developer.amazon.com/alexa/console/ask/test/${amzn_id}/development/${locales[0].replace('-', '_')}/`}
              className="btn btn-primary mr-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Test on Alexa Simulator
            </a>
            <DefaultButton isClear onClick={this.onCertify}>
              Submit for Review
            </DefaultButton>
          </div>
        </div>
      );
    }

    if (!loaded)
      return (
        <div className="super-center h-100 w-100">
          <div className="text-center">
            <h1>
              <span className="loader" />
            </h1>
            Getting Skill Status
          </div>
        </div>
      );

    return (
      <React.Fragment>
        <Modal isOpen={publish} toggle={this.togglePublish} className="stage_modal" centered size="lg" onClosed={this.closePublish}>
          <ModalBody>
            <div className="d-flex justify-content-between" ref={this.privacyTop}>
              <b>{stage_title[stage]}</b>
              <DefaultButton isClose type="button" onClick={this.togglePublish} />
            </div>
            <div className="modal-info">{content}</div>
          </ModalBody>
        </Modal>

        <div className="subheader-page-container">
          <div>
            <div className="pt-3">
              {live ? (
                <div className="alert alert-success mb-4" role="alert">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">This skill currently has a live version in production</h5>
                  </div>
                </div>
              ) : null}
              {amzn_id ? (
                <div className="alert alert-success mb-4" role="alert">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>This skill is linked on Amazon Developer Console</span>
                    <div onClick={() => this.setState({ id_collapse: !id_collapse })} className="pointer">
                      {id_collapse ? 'Hide' : 'More Info'}{' '}
                      <span
                        style={{
                          width: '9px',
                          display: 'inline-block',
                          textAlign: 'right',
                        }}
                      >
                        <i className={`fas fa-caret-left rotate${id_collapse ? ' fa-rotate--90' : ''}`} />
                      </span>
                    </div>
                  </div>
                  <Collapse isOpen={id_collapse}>
                    <hr />
                    <span>Skill ID | </span>
                    <a
                      href={`https://developer.amazon.com/alexa/console/ask/test/${amzn_id}/development/${locales[0].replace('-', '_')}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <b>{amzn_id}</b>
                    </a>
                  </Collapse>
                </div>
              ) : null}
              {disabled_stages.has(stage) ? (
                <div className="alert alert-success mb-4" role="alert">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">This skill is currently in review so you cannot edit it.</h5>
                    <div>
                      <DefaultButton isWhite variant="contained" href={alexaDashboardUrl} target="_blank">
                        Visit Dashboard
                      </DefaultButton>
                      <DefaultButton
                        isPrimary
                        variant="contained"
                        className="ml-3"
                        onClick={() => {
                          onConfirm({
                            text: 'Are you sure you want to withdraw this Skill?',
                            confirm: this.onWithdraw,
                          });
                        }}
                      >
                        Withdraw Skill
                      </DefaultButton>
                    </div>
                  </div>
                </div>
              ) : null}

              <Form>{this.renderBlocks()}</Form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  skill_id: state.skills.skill.skill_id,
  project_id: state.skills.skill.project_id,
});
const mapDispatchToProps = (dispatch) => {
  return {
    updateSkill: (type, val) => dispatch(updateVersion(type, val)),
    updateEntireSkill: (val) => dispatch(updateEntireVersion(val)),
    setConfirm: (confirm) => dispatch(setConfirm(confirm)),
    setError: (err) => dispatch(setError(err)),
    save: (publish, cb) => dispatch(updateSkillDB(publish, cb)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Skill);
