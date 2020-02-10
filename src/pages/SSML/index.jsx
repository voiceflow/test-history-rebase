import React from 'react';

import Header from '@/components/Header';
import Button from '@/componentsV2/Button';
import { FlexEnd } from '@/componentsV2/Flex';
import MadeInVoiceflow from '@/componentsV2/MadeInVoiceflow';
import SSML from '@/componentsV2/SSML';
import removeIntercom from '@/hocs/removeIntercom';
import { useDebouncedCallback } from '@/hooks/callback';
import { useEnableDisable } from '@/hooks/toggle';
import { copy } from '@/utils/clipboard';

import { App, CodeContainer, CopiedMessaged, Page } from './components';

function getInitialValue() {
  try {
    const { text, voice } = JSON.parse(localStorage.getItem('SSML_EDITOR'));
    return { text, voice };
  } catch (err) {
    return { text: '', voice: 'Alexa' };
  }
}

function wrapVoice({ text, voice }) {
  if (voice === 'Alexa') return text;

  return `<voice name="${voice}">${text}</voice>`;
}

function SSMLPage() {
  const [copied, onEnableCopied, onDisableCopied] = useEnableDisable();
  const [state, setState] = React.useState(getInitialValue);
  const [ssml, setSSML] = React.useState(state.text);
  const cache = React.useRef({});

  cache.current.state = state;

  const saveState = React.useCallback(() => {
    localStorage.setItem('SSML_EDITOR', JSON.stringify(cache.current.state));
  }, []);

  const onCopy = React.useCallback(() => {
    copy(wrapVoice(cache.current.state));

    clearTimeout(cache.current.disableCopiedTimeout);

    onEnableCopied();

    cache.current.disableCopiedTimeout = setTimeout(onDisableCopied, 3000);

    saveState();
  }, [onEnableCopied, onDisableCopied, saveState]);

  const onBlur = React.useCallback(({ text }) => setSSML(text), [setSSML]);
  const onChangeVoice = React.useCallback((voice) => {
    setState((state) => ({ ...state, voice }));
  }, []);
  const onEditorStateChange = useDebouncedCallback(
    300,
    (editorState) => setState((state) => ({ ...state, text: editorState.getCurrentContent().getPlainText() })),
    []
  );

  React.useEffect(
    () => () => {
      saveState();
    },
    [saveState, state.voice, ssml]
  );

  return (
    <>
      <MadeInVoiceflow />

      <Header withLogo logoAssetPath="/logo.png" />

      <App>
        <Page>
          <SSML
            value={ssml}
            voice={state.voice}
            onBlur={onBlur}
            onChangeVoice={onChangeVoice}
            withVariablesPlugin={false}
            onEditorStateChange={onEditorStateChange}
          />

          {state.text && (
            <>
              <CodeContainer value={wrapVoice(state)} readOnly />

              <FlexEnd>
                {!!copied && <CopiedMessaged>Copied to clipboard</CopiedMessaged>}

                <Button variant="primary" onClick={onCopy}>
                  Copy
                </Button>
              </FlexEnd>
            </>
          )}
        </Page>
      </App>
    </>
  );
}

export default removeIntercom(SSMLPage);
