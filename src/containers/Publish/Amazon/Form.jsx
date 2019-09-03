import axios from 'axios';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import Toggle from 'react-toggle';
import { Button, ButtonGroup, Collapse, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { compose } from 'redux';
import { getFormValues, reduxForm } from 'redux-form';
import validUrl from 'valid-url';

import Checkbox from '@/components/Checkbox';
import Multiple from '@/components/Forms/Multiple';
import GuidedSteps, { GuidedStepsWrapper } from '@/components/GuidedSteps';
import RadioButtons, { YES_NO_RADIO_BUTTONS } from '@/components/RadioButtons';
import { Spinner } from '@/components/Spinner';
import Image from '@/components/Uploads/Image';
import { FormTextBox } from '@/componentsV2/form/TextBox';
import { FormTextInput } from '@/componentsV2/form/TextInput';
import { setError } from '@/ducks/modal';
import { updateEntireVersion, updateSkillDB, updateVersion } from '@/ducks/version';

import { AMAZON_CATEGORIES } from '../../../services/Categories';
import LOCALE_MAP from '../../../services/LocaleMap';

const PUBLISH_AMAZON_FORM = 'publish_amazon_form';

class Skill extends Component {
  state = {
    loaded: false,
    id_collapse: false,
    stage_error: null,
    validate: {},
    saving: false,
  };

  privacyTop = React.createRef();

  componentDidMount() {
    const { skill_id } = this.props;

    // TODO: Antipattern, fix this when we do redux ( sync with redux store )
    axios
      .get(`/skill/${skill_id}?verbose=1`)
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

        this.setState({
          loaded: true,
          ...res.data,
        });

        this.props.initialize({
          name: res.data.name,
          summary: res.data.summary,
          description: res.data.description,
          keywords: res.data.keywords,
          inv_name: res.data.inv_name,
          instructions: res.data.instructions,
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

  onWithdraw = () => {
    const { amzn_id } = this.props;
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

  componentWillUnmount() {
    if (this.state.loaded) this.save();
  }

  validateForm = async () => {
    const { setError, publish, review } = this.props;

    const s = this.state;
    const split_keywords = s.keywords.split(',');
    if (review) {
      setError('This skill is currently under review and can not be resubmitted');
    } else if (s.privacy_policy && !validUrl.isUri(s.privacy_policy)) {
      setError('Privacy policy must be a url');
    } else if (s.terms_and_cond && !validUrl.isUri(s.terms_and_cond)) {
      setError('Terms and conditions must be a url');
    } else if (split_keywords.length > 30) {
      setError('Limited to 30 keywords');
    } else if (s.keywords.length - split_keywords.length + 1 > 500) {
      setError('All keywords must be less than or equal to 30 keywords or 150 characters.');
    } else if (!s.export) {
      setError('Please Certify Alexa Skill Import/Export in Privacy/Complicance');
    } else if (!s.instructions) {
      setError('Please Provide Testing Instructions');
    } else {
      this.setState({ saving: true });
      await this.save();
      this.setState({ saving: false });
      publish();
    }
  };

  save = async () => {
    const { skill_id, updateEntireSkill } = this.props;
    const s = this.state;
    const category = s.category && s.category.value ? s.category.value : null;

    const name = _.get(this.props.amazonForm, ['name'], null);
    const summary = _.get(this.props.amazonForm, ['summary'], null);
    const description = _.get(this.props.amazonForm, ['description'], null);
    const updatesDescription = _.get(this.props.amazonForm, ['updatesDescription'], null);
    const keywords = _.get(this.props.amazonForm, ['keywords'], null);
    const inv_name = _.get(this.props.amazonForm, ['inv_name'], null);
    const instructions = _.get(this.props.amazonForm, ['instructions'], null);

    const properties = {
      name,
      inv_name,
      summary,
      description,
      updates_description: updatesDescription,
      keywords,
      invocations: s.invocations,
      small_icon: s.small_icon,
      large_icon: s.large_icon,
      category,
      locales: s.locales,
      copa: s.copa,
      privacy_policy: !_.isEmpty(s.privacy_policy) ? s.privacy_policy : '',
      terms_and_cond: s.terms_and_cond,
      purchase: s.purchase,
      personal: s.personal,
      ads: s.ads,
      export: s.export,
      instructions,
    };

    if (!properties.name) {
      throw new Error('Publish Settings not Saved: No Project Name');
    }

    try {
      await axios.patch(`/skill/${skill_id}?publish=true`, {
        ...properties,
        locales: JSON.stringify(properties.locales),
      });

      updateEntireSkill(properties);
    } catch (err) {
      throw new Error('Save Error, Publish Settings not Saved');
    }
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSelection = (value) => {
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
    const { small_icon, large_icon, category, invocations } = this.state;
    const name = _.get(this.props.amazonForm, ['name'], null);
    const summary = _.get(this.props.amazonForm, ['summary'], null);
    const description = _.get(this.props.amazonForm, ['description'], null);
    const inv_name = _.get(this.props.amazonForm, ['inv_name'], null);
    const instructions = _.get(this.props.amazonForm, ['instructions'], null);
    switch (stepNumber) {
      case 0:
        return !!(name && small_icon && large_icon);
      case 1:
        return !!(summary && description && category);
      case 2:
        return !!(inv_name && invocations[0]);
      case 5:
        return !!(this.state.export && instructions);
      default:
        return true;
    }
  };

  renderBlocks = () => {
    const { locales, small_icon, large_icon, category, invocations, privacy_policy, terms_and_cond, copa, name, saving, live } = this.state;

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
              <Label className="publish-label">Display Name *</Label>
              <FormTextInput name="name" type="text" placeholder="Storyflow - Interactive Story Adventures" />
              <FormFeedback>Uh oh! Looks like there is an issue with your email. Please input a correct email.</FormFeedback>
            </div>
          </FormGroup>

          <div className="d-flex mb-5">
            <div style={{ width: '50%' }}>
              <Image
                className="icon-image large-icon text-center pa__icon"
                path="/image/large_icon"
                image={large_icon}
                update={(url) => this.setState({ large_icon: url })}
                title="Large Icon *"
              />
            </div>
            <div style={{ width: '50%' }}>
              <Image
                className="icon-image small-icon text-center pa__icon"
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
            <FormTextInput type="text" name="summary" placeholder="One Sentence Skill Summary" />
          </FormGroup>

          <FormGroup className="mb-4">
            <Label className="publish-label">Description *</Label>
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
            <Label className="publish-label">Category *</Label>
            <Select classNamePrefix="select-box" name="category" value={category} onChange={this.handleSelection} options={AMAZON_CATEGORIES} />
          </FormGroup>

          <FormGroup className="mb-4">
            <Label className="publish-label">
              Keywords (Search Tags) <small>optional</small>
            </Label>
            <FormTextInput type="text" name="keywords" placeholder="Keywords (Separated By Commas) e.g. Game, Space, Adventure" />
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
            <Label className="publish-label">Invocation Name *</Label>
            <FormTextInput type="text" name="inv_name" placeholder="Enter an invocation name" />
          </FormGroup>

          <FormGroup className="mb-4">
            <Label className="publish-label">Invocations *</Label>
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
              name="privacy_policy"
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

    blocks.push({
      title: 'Privacy and Compliance',
      content: (
        <div className="form pa__locale-limited">
          <div className="pb-3 pa__form_container">
            <label>Does this skill allow users to make purchases or spend real money?</label>
            <RadioButtons buttons={YES_NO_RADIO_BUTTONS} checked={this.state.purchase} onChange={(val) => this.onRadio('purchase', val)} />
          </div>
          <div className="pb-3 pa__form_container">
            <label>Does this Alexa skill collect users' personal information?</label>
            <RadioButtons buttons={YES_NO_RADIO_BUTTONS} checked={this.state.personal} onChange={(val) => this.onRadio('personal', val)} />
          </div>
          <div className="pb-3 pa__form_container">
            <label>Does this skill contain advertising?</label>
            <RadioButtons buttons={YES_NO_RADIO_BUTTONS} checked={this.state.ads} onChange={(val) => this.onRadio('ads', val)} />
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
                value="export"
                checked={this.state.export}
                onChange={() => {
                  this.setState({ export: !this.state.export });
                }}
              />
              <div>I Certify</div>
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

    return <GuidedSteps blocks={blocks} checkStep={this.checkValidStep} onFinishSteps={this.validateForm} submitText={enterText} disabled={saving} />;
  };

  render() {
    const { amzn_id, review } = this.props;
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
                    This skill currently under review and can not be submitted again
                  </div>
                </div>
              )}
              {live && (
                <div className="alert alert-success" role="alert">
                  <div className="d-flex justify-content-between align-items-center">This skill currently has a live version in production</div>
                </div>
              )}
              {amzn_id && (
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
                      href={`https://developer.amazon.com/alexa/console/ask/test/${amzn_id}/development/${locales[0].replace('-', '_')}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <b>{amzn_id}</b>
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

const mapStateToProps = (state) => ({
  skill_id: state.skills.skill.skill_id,
  project_id: state.skills.skill.project_id,
  amzn_id: state.skills.skill.amzn_id,
  review: state.skills.skill.review,
  amazonForm: getFormValues(PUBLISH_AMAZON_FORM)(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    updateSkill: (type, val) => dispatch(updateVersion(type, val)),
    updateEntireSkill: (val) => dispatch(updateEntireVersion(val)),
    // setConfirm: (confirm) => dispatch(setConfirm(confirm)),
    setError: (err) => dispatch(setError(err)),
    save: (publish, cb) => dispatch(updateSkillDB(publish, cb)),
  };
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
