// STANDALONE SSML EDITOR
import _ from 'lodash';
import React, { useState } from 'react';
import styled from 'styled-components';

import Header from '@/components/Header';
import SSMLEditor, { Container } from '@/components/SSMLEditor';
import Button from '@/componentsV2/Button';

const Page = styled.div`
  padding-top: 50px;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;

  ${Container} {
    width: 100%;
  }
`;

const CodeContainer = styled.pre`
  width: 100%;
  background-color: #fff;
  border: 1px solid #d4d9e6;
  border-radius: 5px;
  white-space: pre-wrap;
  padding: 20px;
`;

const ExportSection = styled.div`
  width: 100%;

  button {
    margin: 20px auto;
  }
`;

export default function SSML() {
  const [value, updateValue] = useState({ text: '' });
  const [ssml, updateSSML] = useState('');

  const generateCode = () => {
    if (!value.text) return;
    updateSSML(value.text);
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
      <Page>
        <SSMLEditor value={value} onChange={updateValue} />
        <ExportSection>
          <Button variant="secondary" onClick={generateCode} disabled={!value.text.trim()}>
            Export SSML
          </Button>
          {ssml && <CodeContainer>{ssml}</CodeContainer>}
        </ExportSection>
      </Page>
    </>
  );
}
