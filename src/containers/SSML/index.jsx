// STANDALONE SSML EDITOR
import _ from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import Textarea from 'react-textarea-autosize';
import styled from 'styled-components';

import Header from '@/components/Header';
import SSMLEditor, { Container } from '@/components/SSMLEditor';
import Button from '@/componentsV2/Button';
import { setError } from '@/ducks/modal';
import removeIntercom from '@/hocs/removeIntercom';

const App = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding-bottom: 100px;
`;
const Page = styled.div`
  padding-top: 50px;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;

  ${Container} {
    width: 100%;
  }
`;

const CodeContainer = styled(Textarea)`
  width: 100%;
  font-family: monospace;
  border: 1px solid #d4d9e6;
  border-radius: 5px;
  white-space: pre-wrap;
  padding: 20px;
  resize: none;
  margin: 40px 0 20px 0;
  box-shadow: 0px 1px 3px rgba(17, 49, 96, 0.06);
`;

const ExportSection = styled.div`
  width: 100%;
  padding-top: 20px;
  text-align: right;

  button {
    display: inline-block;
  }
`;

function SSML(props) {
  const { setError } = props;
  const [value, updateValue] = useState({ text: '' });
  const [ssml, updateSSML] = useState('');
  const [copied, setCopied] = useState(false);

  const generateCode = () => {
    if (!value.text) return;
    updateSSML(value.text);
  };

  const copyCode = () => {
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = ssml;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);

    if (copied) clearInterval(copied);
    setCopied(setTimeout(() => setCopied(false), 3000));
  };

  return (
    <>
      <a id="MadeInVoiceflow" href="https://voiceflow.com" target="_blank" rel="noopener noreferrer">
        <img src="/favicon.png" alt="Voiceflow" />
        <span>Made In Voiceflow</span>
      </a>
      <Header
        leftRenderer={() => (
          <a href="https://www.voiceflow.com" className="mx-2">
            <img className="voiceflow-logo" src="/logo.png" alt="logo" />
          </a>
        )}
        centerRenderer={_.constant('SSML Editor (ALPHA)')}
      />
      <App>
        <Page>
          <SSMLEditor value={value} onChange={updateValue} setError={setError} />
          <ExportSection>
            <Button variant="primary" onClick={generateCode} disabled={!value.text.trim()}>
              Generate SSML
            </Button>
            {ssml && (
              <>
                <CodeContainer value={ssml} onChange={(e) => updateSSML(e.target.value)} />
                <div>
                  {!!copied && <small className="light-blue mr-3">Copied to clipboard</small>}
                  <Button variant="secondary" onClick={copyCode}>
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

const mapDispatchToProps = {
  setError,
};

export default removeIntercom(
  connect(
    null,
    mapDispatchToProps
  )(SSML)
);
