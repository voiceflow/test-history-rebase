// STANDALONE SSML EDITOR
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from '@/components/Header';
import SSMLEditor from '@/components/SSMLEditor';
import Button from '@/componentsV2/Button';
import { setError } from '@/ducks/modal';
import removeIntercom from '@/hocs/removeIntercom';

import { App, CodeContainer, ExportSection, Page } from './components';

class SSML extends Component {
  constructor(props) {
    super(props);

    let value;
    try {
      value = JSON.parse(localStorage.getItem('SSML_EDITOR'));
    } catch (err) {
      console.error(err);
    }
    if (!value) value = { text: '' };

    this.state = {
      value,
      ssml: '',
      copied: false,
    };
  }

  saveValue = () => {
    localStorage.setItem('SSML_EDITOR', JSON.stringify(this.state.value));
  };

  componentWillUnmount = () => {
    this.saveValue();
  };

  generateCode = () => {
    const { value } = this.state;
    if (!value.text) return;
    this.saveValue();
    this.setState({
      ssml: value.text,
    });
  };

  copyCode = () => {
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = this.state.ssml;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);

    if (this.copyInterval) clearInterval(this.copyInterval);

    this.setState({ copied: true });
    this.copyInterval = setTimeout(() => this.setState({ copied: false }), 3000);
  };

  updateSSML = (e) => {
    this.setState({
      ssml: e.target.value,
    });
  };

  updateValue = (value) => {
    this.setState({ value });
  };

  render() {
    const { value, ssml, copied } = this.state;
    const { setError } = this.props;

    return (
      <>
        <a id="MadeInVoiceflow" href="https://voiceflow.com" target="_blank" rel="noopener noreferrer">
          <img src="/favicon.png" alt="Voiceflow" />
          <span>Made In Voiceflow</span>
        </a>
        <Header withLogo logoAssetPath="/logo.png" centerRenderer={_.constant('SSML Editor (ALPHA)')} />
        <App>
          <Page>
            <SSMLEditor value={value} onChange={this.updateValue} setError={setError} />
            <ExportSection>
              <Button variant="primary" onClick={this.generateCode} disabled={!value.text.trim()}>
                Generate SSML
              </Button>
              {ssml && (
                <>
                  <CodeContainer value={ssml} onChange={this.updateSSML} />
                  <div>
                    {!!copied && <small className="light-blue mr-3">Copied to clipboard</small>}
                    <Button variant="secondary" onClick={this.copyCode}>
                      Copy
                    </Button>
                  </div>
                </>
              )}
            </ExportSection>
          </Page>
        </App>
      </>
    );
  }
}

const mapDispatchToProps = {
  setError,
};

export default removeIntercom(
  connect(
    null,
    mapDispatchToProps
  )(SSML)
);
