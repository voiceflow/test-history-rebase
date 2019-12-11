import { constants } from '@voiceflow/common';
import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup, Collapse, Form, FormGroup, Label } from 'reactstrap';
import styled from 'styled-components';

import ClipBoard from '@/components/ClipBoard/ClipBoard';
import { Spinner } from '@/components/Spinner';
import { userSelector } from '@/ducks/account';
import { setError } from '@/ducks/modal';
import { publishStateSelector, updatePublishInfo } from '@/ducks/publish/google';
import { activeNameSelector, activeSkillIDSelector } from '@/ducks/skill';

import GuidedSteps, { GuidedStepsWrapper } from '../../../components/GuidedSteps';
import UnlinkProject from './Unlink';
import googleFormAdapter from './googleAdapter';

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
  flex: 1;
`;

const LegalDisclaimer = styled.div`
  font-size: 11px;
  color: #62778c;
  padding: 8px 0;
  border-bottom: 1px solid #eaeff4;
  margin-bottom: 24px;
`;

class GooglePublish extends Component {
  state = {
    loaded: false,
    name: this.props.name,
    locales: [],
    main_locale: null,
    id_collapse: false,
  };

  render() {
    const { googleId, googleEmail } = this.props;
    const { loaded, id_collapse, live } = this.state;

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
          {googleId && (
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
                <div className="space-between">
                  <div>
                    <span>Project ID | </span>
                    <a
                      href={`https://console.actions.google.com/u/${googleEmail}/project/${googleId}/simulator`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <b>{googleId} </b>
                    </a>
                  </div>
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

  onPublish = async () => {
    await this.save();
    this.props.publish();
  };

  async componentDidMount() {
    const { versionID, setError } = this.props;

    try {
      const res = await axios.get(`/skill/google/${versionID}`);
      const properties = googleFormAdapter.fromDB(res.data);
      this.setState({
        loaded: true,
        ...properties,
      });
    } catch (err) {
      this.setState({ loaded: true });
      setError(err.response.data);
    }
  }

  componentWillUnmount() {
    if (this.state.loaded && !this.props.isLocked) this.save();
  }

  save = async () => {
    const { setError, versionID, updatePublishInfo, googleId } = this.props;
    const { locales, main_locale } = this.state;

    const googlePublishInfo = {
      locales,
      main_locale,
    };

    try {
      await axios.patch(`/skill/${versionID}?platform=google&publish=true`, { google_publish_info: googlePublishInfo });
      updatePublishInfo({ ...googlePublishInfo, googleId });
    } catch (err) {
      setError('Save Error, updates not saved');
    }
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
    const { googleId, googleEmail, user, name } = this.props;
    const { main_locale } = this.state;

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
            <Label className="publish-label">Main Language</Label>
            <ButtonGroup className="locale-button-group">
              {FORMATTED_LOCALES.map((locale, i) => {
                const active = main_locale === locale.value ? 'active' : '';
                return (
                  <Button
                    outline
                    color="primary"
                    className={`locale-button ${active}`}
                    key={i}
                    onClick={() => {
                      this.onMainLocaleBtnClick(locale.value);
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
              Your Action's <b>Main Language</b> determines its availability. Your Action will be available in regions which speak your selected
              language.
            </p>
          </div>
        </>
      ),
    });

    const terms = `${window.location.origin}/creator/terms?name=${encodeURI(user.name)}&skill=${encodeURI(name)}`;

    blocks.push({
      title: 'Legal',
      content: (
        <>
          <LegalDisclaimer>
            Unfortunately the Privacy Policy or Terms and Conditions for Google Actions must be updated manually. Copy these links into the "Privacy
            and Consent" portion of the{' '}
            <a
              href={`https://console.actions.google.com/u/${googleEmail}/project/${googleId}/directoryinformation/`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Action Console
            </a>
            .
          </LegalDisclaimer>

          <FormGroup>
            <Label className="publish-label">Privacy Policy URL</Label>
            <ClipBoard name="link" value={terms}>
              <PrivacyPolicyLink>{terms}</PrivacyPolicyLink>
            </ClipBoard>
          </FormGroup>

          <FormGroup className="mb-4">
            <Label className="publish-label">Terms and Conditions URL</Label>
            <ClipBoard name="link" value={terms}>
              <PrivacyPolicyLink>{terms}</PrivacyPolicyLink>
            </ClipBoard>
          </FormGroup>
        </>
      ),
    });

    return <GuidedSteps blocks={blocks} checkStep={this.checkValidStep} onFinishSteps={this.onPublish} submitText={enterText} forceFollow />;
  };
}

const mapStateToProps = (state) => ({
  user: userSelector(state),
  name: activeNameSelector(state),
  googleId: publishStateSelector(state).googleId,
  versionID: activeSkillIDSelector(state),
  googleEmail: state.account.google?.profile?.email || '0',
});

const mapDispatchToProps = {
  setError,
  updatePublishInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GooglePublish);
