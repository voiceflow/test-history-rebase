import axios from 'axios';
import _ from 'lodash';
import React, { Component } from 'react';
import Select from 'react-select';
import Toggle from 'react-toggle';
import { Button, ButtonGroup, Collapse, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { compose } from 'redux';
import { getFormValues, reduxForm } from 'redux-form';
import validUrl from 'valid-url';

import Checkbox from '@/components/Checkbox';
import Multiple from '@/components/Forms/Multiple';
import GuidedSteps, { GuidedStepsWrapper } from '@/components/GuidedSteps';
import RadioGroup from '@/components/RadioGroup';
import { Spinner } from '@/components/Spinner';
import Image from '@/components/Uploads/Image';
import { FormTextBox } from '@/componentsV2/form/TextBox';
import { FormTextInput } from '@/componentsV2/form/TextInput';
import { userSelector } from '@/ducks/account';
import { setError } from '@/ducks/modal';
import { amznIDSelector, reviewSelector } from '@/ducks/publish/alexa';
import { activeSkillIDSelector, updateActiveSkill, updateSkillMeta } from '@/ducks/skill';
import { connect } from '@/hocs';
import amazonFormAdapter from '@/pages/Publish/Amazon/amazonAdaptor';

import { AMAZON_CATEGORIES } from '../../../services/Categories';
import LOCALE_MAP from '../../../services/LocaleMap';

const DEFAULT_TERM_ENDPOINT = 'https://creator.voiceflow.com/creator';
const PUBLISH_AMAZON_FORM = 'publish_amazon_form';
const generateTerms = (name, skill, children) => {
  return `${DEFAULT_TERM_ENDPOINT}/terms?name=${encodeURI(name)}&skill=${encodeURI(skill)}${_.isBoolean(children) ? `&children=${children}` : ''}`;
};

class Skill extends Component {
  state = {
    loaded: false,
    id_collapse: false,
    stage_error: null,
    validate: {},
    saving: false,
  };

  componentDidMount() {
    const { skillID } = this.props;
    axios
      .get(`/skill/${skillID}?verbose=1`)
      .then((res) => {
        const skill = amazonFormAdapter.fromDB(res.data);

        this.setState(
          {
            loaded: true,
            ...skill,
          },
          this.updateTerms
        );

        this.props.initialize({
          name: skill.name,
          summary: skill.summary,
          description: skill.description,
          keywords: skill.keywords,
          inv_name: skill.invName,
          instructions: skill.instructions,
        });
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
  }

  onRadio = (type, value) => {
    this.setState({
      [type]: value,
    });
  };

  componentWillUnmount() {
    if (this.state.loaded && !this.props.isLocked) this.save();
  }

  validateForm = async () => {
    const { setError, publish, review } = this.props;

    const formState = this.state;
    const split_keywords = formState.keywords.split(',');
    switch (true) {
      case review:
        setError('This skill is currently under review and can not be resubmitted');
        break;
      case formState.privacyPolicy && !validUrl.isUri(formState.privacyPolicy):
        setError('Privacy policy must be a url');
        break;
      case formState.termsAndCond && !validUrl.isUri(formState.termsAndCond):
        setError('Terms and conditions must be a url');
        break;
      case split_keywords.length > 30:
        setError('Limited to 30 keywords');
        break;
      case formState.keywords.length - split_keywords.length + 1 > 500:
        setError('All keywords must be less than or equal to 30 keywords or 150 characters.');
        break;
      case !formState.export:
        setError('Please Certify Alexa Skill Import/Export in Privacy/Complicance');
        break;
      case !formState.instructions:
        setError('Please Provide Testing Instructions');
        break;
      default:
        this.setState({ saving: true });
        await this.save();
        this.setState({ saving: false });
        publish();
        break;
    }
  };

  getFormValueObj = () => {
    const { amazonForm } = this.props;
    const name = _.get(amazonForm, ['name'], null);
    const summary = _.get(amazonForm, ['summary'], null);
    const description = _.get(amazonForm, ['description'], null);
    const updatesDescription = _.get(amazonForm, ['updatesDescription'], null);
    const keywords = _.get(amazonForm, ['keywords'], null);
    const invName = _.get(amazonForm, ['inv_name'], null);
    const instructions = _.get(amazonForm, ['instructions'], null);
    return {
      name,
      summary,
      description,
      updatesDescription,
      keywords,
      invName,
      instructions,
    };
  };

  save = async () => {
    const { skillID, updateSkill, updateSkillMeta } = this.props;
    const amazonFormObj = this.getFormValueObj();
    const formState = this.state;

    const toDbProperties = amazonFormAdapter.toDb(formState, amazonFormObj);
    const toStoreProperties = amazonFormAdapter.toStore(formState, amazonFormObj);

    if (!amazonFormObj.name) {
      throw new Error('Publish Settings not Saved: No Project Name');
    }

    try {
      await axios.patch(`/skill/${skillID}?publish=true`, toDbProperties);
      updateSkillMeta(toStoreProperties.meta);
      updateSkill(toStoreProperties.skill);
    } catch (err) {
      throw new Error('Save Error, Publish Settings not Saved');
    }
  };

  handleChangeUrl = (event) => {
    event.persist();
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSelection = (value) => {
    // selecting Amazon categories
    this.setState({
      category: value,
    });
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
    const { smallIcon, largeIcon, category, invocations, export: stateExport } = this.state;
    const formValue = this.getFormValueObj();
    switch (stepNumber) {
      case 0:
        return !!(formValue.name && smallIcon && largeIcon);
      case 1:
        return !!(formValue.summary && formValue.description && category);
      case 2:
        return !!(formValue.invName && invocations[0]);
      case 5:
        return !!(stateExport && formValue.instructions);
      default:
        return true;
    }
  };

  updateTerms = () => {
    const { user } = this.props;
    const { termsAndCond, privacyPolicy, name, copa } = this.state;
    if (!termsAndCond || termsAndCond.startsWith(DEFAULT_TERM_ENDPOINT)) {
      this.setState({ termsAndCond: generateTerms(user.name, name, copa) });
    }
    if (!privacyPolicy || privacyPolicy.startsWith(DEFAULT_TERM_ENDPOINT)) {
      this.setState({ privacyPolicy: generateTerms(user.name, name, copa) });
    }
  };

  renderBlocks = () => {
    const {
      locales,
      name,
      saving,
      live,
      smallIcon,
      largeIcon,
      category,
      invocations,
      privacyPolicy,
      termsAndCond,
      copa,
      purchase,
      personal,
      ads,
      export: stateExport,
    } = this.state;

    const { amznID, review } = this.props;

    const blocks = [];
    const enterText = (
      <>
        Submit for Review
        {saving && (
          <span className="ml-2">
            <i className="fas fa-sync fa-spin" />
          </span>
        )}
      </>
    );

    blocks.push({
      title: 'Basic Skill Info',
      content: (
        <>
          <FormGroup className="mb-4">
            <div className="mb-4">
              <Label className="publish-label">Display Name</Label>
              <FormTextInput name="name" type="text" placeholder="Storyflow - Interactive Story Adventures" />
              <FormFeedback>Uh oh! Looks like there is an issue with your email address. Please provide a correct email address.</FormFeedback>
            </div>
          </FormGroup>

          <div className="d-flex mb-5">
            <div style={{ width: '50%' }}>
              <Image
                className="icon-image large-icon text-center pa__icon"
                path="/image/large_icon"
                image={largeIcon}
                update={(url) => this.setState({ largeIcon: url })}
                title="Large Icon"
              />
            </div>
            <div style={{ width: '50%' }}>
              <Image
                className="icon-image small-icon text-center pa__icon"
                path="/image/small_icon"
                image={smallIcon}
                update={(url) => this.setState({ smallIcon: url })}
                title="Small Icon"
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
            <Label className="publish-label">Summary</Label>
            <FormTextInput type="text" name="summary" placeholder="One Sentence Skill Summary" />
          </FormGroup>

          <FormGroup className="mb-4">
            <Label className="publish-label">Description</Label>
            <FormTextBox
              name="description"
              minRows={4}
              maxRows={4}
              placeholder="Skill Description"
              style={{ minHeight: '94px', maxHeight: '94px' }}
            />
          </FormGroup>

          {live && (
            <FormGroup className="mb-4">
              <Label className="publish-label">
                What's new? <small>optional</small>
              </Label>
              <FormTextBox
                name="updatesDescription"
                minRows={4}
                maxRows={4}
                placeholder="What's new?"
                style={{ minHeight: '94px', maxHeight: '94px' }}
              />
            </FormGroup>
          )}

          <FormGroup className="mb-4">
            <Label className="publish-label">Category</Label>
            <Select
              menuPortalTarget={document.body}
              classNamePrefix="select-box"
              name="category"
              value={category}
              onChange={this.handleSelection}
              options={AMAZON_CATEGORIES}
            />
          </FormGroup>

          <FormGroup className="mb-4">
            <Label className="publish-label">
              Keywords <small>Seperated by commas</small>
            </Label>
            <FormTextInput type="text" name="keywords" placeholder="e.g. Game, Quiz, Space..." />
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
          {live && (
            <div className="publish-info">
              <p className="helper-text">
                <b>What's new?</b> is where you can describe new features and fixes in this version of your Skill.
              </p>
            </div>
          )}
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
            <Label className="publish-label">Invocation Name</Label>
            <FormTextInput type="text" name="inv_name" placeholder="Enter an invocation name" />
          </FormGroup>

          <FormGroup className="mb-4">
            <Label className="publish-label">Invocations</Label>
            <Multiple
              className="mt-0 input-group-text"
              list={invocations}
              max={3}
              prepend="Alexa,"
              update={(list) => this.setState({ invocations: list })}
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
              name="privacyPolicy"
              placeholder="Privacy Policy"
              value={privacyPolicy}
              onChange={this.handleChangeUrl}
            />
          </FormGroup>

          <FormGroup className="mb-4">
            <div className="mb-4">
              <Label className="publish-label">Terms and Conditions URL</Label>
              <Input
                className="form-bg"
                type="text"
                name="termsAndCond"
                placeholder="Terms and Conditions"
                value={termsAndCond}
                onChange={this.handleChangeUrl}
              />
            </div>

            <Label className="publish-label">Is this skill directed to children under the age of 13?</Label>
            <div className="d-flex">
              <u className="mr-2">{copa ? 'YES' : 'NO'}</u>
              <Toggle checked={copa} icons={false} onChange={() => this.setState({ copa: !copa }, this.updateTerms)} />
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

    blocks.push({
      title: 'Privacy and Compliance',
      content: (
        <div className="form pa__locale-limited">
          <div className="pb-3 pa__form_container">
            <label>Does this skill allow users to make purchases or spend real money?</label>
            <RadioGroup name="purchase" checked={purchase} onChange={(val) => this.onRadio('purchase', val)} />
          </div>
          <div className="pb-3 pa__form_container">
            <label>Does this Alexa skill collect users' personal information?</label>
            <RadioGroup name="personal" checked={personal} onChange={(val) => this.onRadio('personal', val)} />
          </div>
          <div className="pb-3 pa__form_container">
            <label>Does this skill contain advertising?</label>
            <RadioGroup name="ads" checked={ads} onChange={(val) => this.onRadio('ads', val)} />
          </div>
          <div>
            <label>Export Compliance</label>
            <div style={{ color: '#62778c' }}>
              This Alexa skill may be imported to and exported from the United States and all other countries and regions in which Amazon operates
              their program or in which you've authorized sales to end users (without the need for us to obtain any license or clearance or take any
              other action) and is in full compliance with all applicable laws and regulations governing imports and exports, including those
              applicable to software that makes use of encryption technology.
            </div>
            <div className="pb-3 pa__checkbox_container">
              <Checkbox
                checked={stateExport}
                onChange={() => {
                  this.setState({ export: !stateExport });
                }}
              >
                <div>I Certify</div>
              </Checkbox>
            </div>
          </div>
          <div className="">
            <Label>Testing Instructions</Label>
            <FormTextBox
              name="instructions"
              minRows={3}
              maxRows={3}
              placeholder="Any Particular Testing Instructions for Amazon Approval Process"
              style={{ minHeight: '94px', maxHeight: '94px' }}
            />
          </div>
        </div>
      ),
      description: (
        <>
          <div className="publish-info">
            <p className="helper-text">
              Personal Information includes anything that can identify the user such as name, email, password, phone number, birth date, etc.
            </p>
          </div>
          <div className="publish-info">
            <p className="helper-text">
              Indicate if this skill is directed to children under the age of 13, as determined under the Children's Online Privacy Protection Act
              (COPPA).
            </p>
          </div>
          <div className="publish-info">
            <p className="helper-text">
              Please detail any special instructions our team will need in order to test your skill. Include any account or hardware requirements. If
              your skill requests permissions, include ways to test these permissions requests. This information is not displayed to customers.
            </p>
          </div>
        </>
      ),
    });

    return (
      <GuidedSteps
        blocks={blocks}
        checkStep={this.checkValidStep}
        onFinishSteps={this.validateForm}
        submitText={enterText}
        disabled={saving || review}
        preventSubmit={!amznID && { message: 'You must upload to Amazon at least once on the canvas before submitting for review' }}
      />
    );
  };

  render() {
    const { amznID, review } = this.props;
    const { locales, loaded, live, id_collapse } = this.state;

    if (!loaded)
      return (
        <div className="super-center h-100 w-100">
          <Spinner message="Getting Skill Status" />
        </div>
      );

    return (
      <>
        <div className="subheader-page-container">
          <div>
            <GuidedStepsWrapper className="pb-0">
              {review && (
                <div className="alert alert-success" role="alert">
                  <div className="d-flex justify-content-between align-items-center">
                    This skill currently under review and can not be submitted again or edited
                  </div>
                </div>
              )}
              {live && (
                <div className="alert alert-success" role="alert">
                  <div className="d-flex justify-content-between align-items-center">This skill currently has a live version in production</div>
                </div>
              )}
              {amznID && (
                <div className="alert alert-success" role="alert">
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
                      href={`https://developer.amazon.com/alexa/console/ask/test/${amznID}/development/${locales[0].replace('-', '_')}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <b>{amznID}</b>
                    </a>
                  </Collapse>
                </div>
              )}
            </GuidedStepsWrapper>
            <form onSubmit={this.props.handleSubmit(this.save)}>{this.renderBlocks()}</form>
          </div>
        </div>
      </>
    );
  }
}

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Display name is required.';
  }
  if (!values.summary) {
    errors.summary = 'Display Summary is required.';
  }
  if (!values.description) {
    errors.description = 'Display description is required.';
  }
  if (!values.inv_name) {
    errors.inv_name = 'Invocation name is required.';
  }
  if (!values.instructions) {
    errors.instructions = 'Testing instructions are required.';
  }
  return errors;
};

const mapStateToProps = {
  user: userSelector,
  skillID: activeSkillIDSelector,
  amznID: amznIDSelector,
  review: reviewSelector,
  amazonForm: getFormValues(PUBLISH_AMAZON_FORM),
};

const mapDispatchToProps = {
  updateSkill: updateActiveSkill,
  updateSkillMeta,
  setError,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  reduxForm({
    form: PUBLISH_AMAZON_FORM,
    validate,
  })
)(Skill);
