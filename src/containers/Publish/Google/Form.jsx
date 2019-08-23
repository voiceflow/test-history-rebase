import { constants } from '@voiceflow/common';
import axios from 'axios';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import { Button as ReactstrapButton, ButtonGroup, Collapse, Form, FormGroup, Input, Label } from 'reactstrap';
import styled from 'styled-components';

import ClipBoard from '@/components/ClipBoard/ClipBoard';
import { Spinner } from '@/components/Spinner';
import { setError } from '@/ducks/modal';
import { updateEntireVersion } from '@/ducks/version';

import GuidedSteps, { GuidedStepsWrapper } from '../../../components/GuidedSteps';
import UnlinkProject from './Unlink';

const { GOOGLE_LOCALES } = constants.locales;

const L = GOOGLE_LOCALES;
const LOCALE_DISPLAY_NAMES = {
  [L.HK]: 'Chinese-Cantonese (zh-HK)',
  [L.CN]: 'Chinese-Simplified (zh-CN)',
  [L.TW]: 'Chinese-Traditional (zh-TW)',
  [L.DA]: 'Danish (da)',
  [L.NL]: 'Dutch (nl)',
  [L.EN]: 'English (en)',
  [L.FR]: 'French (fr)',
  [L.DE]: 'German (de)',
  [L.HI]: 'Hindi (hi)',
  [L.ID]: 'Indonesian (id)',
  [L.IT]: 'Italian (it)',
  [L.JA]: 'Japanese (ja)',
  [L.KO]: 'Korean (ko)',
  [L.NO]: 'Norwegian (no)',
  [L.PL]: 'Polish (pl)',
  [L.PT]: 'Portuguese (pt)',
  [L.BR]: 'Portuguese-Brazilian (pt-BR)',
  [L.RU]: 'Russian (ru)',
  [L.ES]: 'Spanish (es)',
  [L.SV]: 'Swedish (sv)',
  [L.TH]: 'Thai (th)',
  [L.TR]: 'Turkish (tr)',
  [L.UK]: 'Ukranian (uk)',
};

const FORMATTED_LOCALES = Object.keys(GOOGLE_LOCALES).map((key) => {
  return { value: GOOGLE_LOCALES[key], name: LOCALE_DISPLAY_NAMES[GOOGLE_LOCALES[key]] };
});

const PrivacyPolicyLink = styled.div`
  color: #8da2b5;
  font-size: 13px;
`;

const LegalDisclaimer = styled.div`
  font-size: 11px;
  color: #62778c;
  padding: 8px 0;
  border-bottom: 1px solid #eaeff4;
  margin-bottom: 24px;
`;

class GooglePublish extends Component {
  constructor(props) {
    super(props);

    const { skill } = this.props;

    this.state = {
      loaded: false,
      google_id: '',
      name: skill.name,
      locales: [],
      main_locale: null,
      id_collapse: false,
      modify_url: false,
    };
  }

  render() {
    const { google_link_user, google_id, loaded, id_collapse, modify_url, live } = this.state;

    if (!loaded)
      return (
        <div className="super-center h-100 w-100">
          <Spinner message="Getting Action Status" />
        </div>
      );

    return (
      <div className="subheader-page-container">
        <GuidedStepsWrapper>
          {live ? (
            <div className="alert alert-success mb-4" role="alert">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">This Action currently has a live version in production</h5>
              </div>
            </div>
          ) : null}
          {google_id && (
            <div className="alert alert-success mb-4" role="alert">
              <div className="d-flex justify-content-between align-items-center">
                <span>This Action is linked on the Google Actions Console</span>
                <b onClick={() => this.setState({ id_collapse: !id_collapse })} className="pointer">
                  {id_collapse ? 'Hide' : 'More Info'}{' '}
                  <span style={{ width: '9px', display: 'inline-block', textAlign: 'right' }}>
                    <i className={`fas fa-caret-left rotate${id_collapse ? ' fa-rotate--90' : ''}`} />
                  </span>
                </b>
              </div>
              <Collapse isOpen={id_collapse}>
                <hr />
                <div>
                  <span>Project ID | </span>
                  <a
                    href={`https://console.actions.google.com/u/${google_link_user || '0'}/project/${google_id}/simulator`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <b>{google_id} </b>
                  </a>

                  {!modify_url && (
                    <span
                      onClick={() => {
                        this.setState({ modify_url: true });
                      }}
                      className="tooltip-link ml-2"
                    >
                      Link not working? Modify your google user ID
                    </span>
                  )}

                  {modify_url && (
                    <span className="ml-2 google-link-publish">
                      <a
                        href={`https://console.actions.google.com/u/${google_link_user || '0'}/project/${google_id}/simulator`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {'https://console.actions.google.com/u/'}
                        <span>
                          <Input
                            className="google-link-input"
                            name="google_link_user"
                            value={google_link_user}
                            onChange={this.handleChange}
                            onClick={(e) => e.preventDefault()}
                          />
                        </span>
                        {`/project/${google_id}/simulator`}
                      </a>
                      <Tooltip
                        target="tooltip"
                        className="menu-tip"
                        theme="menu"
                        position="bottom"
                        title="This changes the Google Account that your link points to. A value of '0' will use your default Google Account, '1' will use the second Google Account you are logged into, and so on."
                      >
                        <i className="fas fa-question" />
                      </Tooltip>
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <UnlinkProject />
                </div>
              </Collapse>
            </div>
          )}
          <Form>{this.renderBlocks()}</Form>
        </GuidedStepsWrapper>
      </div>
    );
  }

  onPublish = () =>
    this.save(true, () => {
      this.props.publish();
    });

  async componentDidMount() {
    const { skill_id, setError } = this.props;

    // TODO : get google id

    try {
      const res = await axios.get(`/skill/google/${skill_id}`);

      if (!_.isObject(res.data.publish_info)) {
        res.data.publish_info = {};
      }

      const publish_info = res.data.publish_info;

      if (!publish_info.locales) {
        publish_info.locales = [];
      }
      if (!publish_info.main_locale) {
        publish_info.main_locale = 'en';
      }

      if (!publish_info.google_link_user) {
        publish_info.google_link_user = '0';
      }

      const { google_id, privacy_policy, terms_and_cond } = res.data;

      // TODO: Antipattern, fix this when we do redux
      this.setState({
        loaded: true,
        ...publish_info,
        google_id,
        privacy_policy,
        terms_and_cond,
      });
    } catch (err) {
      this.setState({ loaded: true });
      setError(err.response.data);
    }
  }

  componentWillUnmount() {
    const { loaded } = this.state;
    if (loaded) {
      this.save(true);
    }
  }

  save = (publish = false, cb) => {
    const { setError, skill_id, skill, updateEntireSkill } = this.props;
    const { locales, main_locale, google_link_user, google_id } = this.state;

    const google_publish_info = {
      locales,
      main_locale,
      google_link_user,
    };

    axios
      .patch(`/skill/${skill_id}?platform=google${publish === true ? '&publish=true' : ''}`, { google_publish_info })
      .then(() => {
        updateEntireSkill({ ...skill, google_publish_info, google_id });
        // eslint-disable-next-line callback-return
        if (typeof cb === 'function') cb();
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
        setError('Save Error, updates not saved');
      });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  onMainLocaleBtnClick = (locale) => {
    this.setState({
      main_locale: locale,
    });
  };

  checkValidStep = (stepNumber) => {
    const { main_locale } = this.state;
    if (stepNumber === 0) return !!main_locale;

    return true;
  };

  renderBlocks = () => {
    const { google_id, main_locale, privacy_policy, terms_and_cond } = this.state;

    const blocks = [];
    const enterText = (
      <>
        Publish Action
        <i className="fab fa-google ml-2" />
      </>
    );

    blocks.push({
      title: 'Languages',
      content: (
        <>
          <FormGroup className="mb-4 pa__locale-limited">
            <Label className="publish-label">Main Language *</Label>
            <ButtonGroup className="locale-button-group">
              {FORMATTED_LOCALES.map((locale, i) => {
                const active = main_locale === locale.value ? 'active' : '';
                return (
                  <ReactstrapButton
                    outline
                    color="primary"
                    className={`locale-button ${active}`}
                    key={i}
                    onClick={() => {
                      this.onMainLocaleBtnClick(locale.value);
                    }}
                  >
                    {locale.name}
                  </ReactstrapButton>
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
              Your Action's <b>Main Language</b> determines its availability. Your Action will be available in regions which speak your selected
              language.
            </p>
          </div>
        </>
      ),
    });

    blocks.push({
      title: 'Legal',
      content: (
        <>
          <LegalDisclaimer>
            Unfortunately the Privacy Policy or Terms and Conditions for Google Actions must be updated manually. Copy these links into the "Privacy
            and Consent" portion of the{' '}
            <a href={`https://console.actions.google.com/project/${google_id}/directoryinformation/`} target="_blank" rel="noopener noreferrer">
              Google Action Console
            </a>
            .
          </LegalDisclaimer>

          <FormGroup>
            <Label className="publish-label">Privacy Policy URL</Label>
            <ClipBoard name="link" value={privacy_policy}>
              <PrivacyPolicyLink>{privacy_policy}</PrivacyPolicyLink>
            </ClipBoard>
          </FormGroup>

          <FormGroup className="mb-4">
            <Label className="publish-label">Terms and Conditions URL</Label>
            <ClipBoard name="link" value={terms_and_cond}>
              <PrivacyPolicyLink>{terms_and_cond}</PrivacyPolicyLink>
            </ClipBoard>
          </FormGroup>
        </>
      ),
    });

    return <GuidedSteps blocks={blocks} checkStep={this.checkValidStep} onFinishSteps={this.onPublish} submitText={enterText} forceFollow />;
  };
}

const mapStateToProps = (state) => ({
  skill: state.skills.skill,
  skill_id: state.skills.skill.skill_id,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setError: (err) => dispatch(setError(err)),
    updateEntireSkill: (val) => dispatch(updateEntireVersion(val)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GooglePublish);
