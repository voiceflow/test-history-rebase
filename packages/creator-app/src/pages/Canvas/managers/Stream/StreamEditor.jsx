import { SLOT_REGEXP } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';
import { ErrorMessageWithDivider } from '@voiceflow/ui';
import React from 'react';

import Checkbox from '@/components/Checkbox';
import OverflowMenu from '@/components/OverflowMenu';
import Section from '@/components/Section';
import VariablesInput from '@/components/VariablesInput';
import { HTTPS_URL_REGEX } from '@/constants';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import { useEnableDisable } from '@/hooks';
import { Content, Controls, FormControl } from '@/pages/Canvas/components/Editor';
import { EngineContext } from '@/pages/Canvas/contexts';
import { PlatformContext } from '@/pages/Skill/contexts';

import { HelpMessage, HelpTooltip, VisualsForm } from './components';

const isValidURL = (url) => url.match(HTTPS_URL_REGEX) || url.match(SLOT_REGEXP);

function StreamEditor({ data, focusedNode, onChange }) {
  const platform = React.useContext(PlatformContext);
  const [invalidAudio, setValidAudio, setInvalidAudio] = useEnableDisable(false);
  const engine = React.useContext(EngineContext);

  const hadPause = data.customPause;
  const isAlexa = platform === Constants.PlatformType.ALEXA;
  const toggleLoop = React.useCallback(() => onChange({ loop: !data.loop }), [data.loop, onChange]);
  const updateAudio = React.useCallback(
    ({ text }) => {
      if (isValidURL(text)) {
        onChange({ audio: text });
        setInvalidAudio();
      } else {
        setValidAudio();
      }
    },
    [onChange, setInvalidAudio, setValidAudio]
  );

  const togglePause = React.useCallback(async () => {
    if (hadPause) {
      await engine.port.remove(focusedNode.ports.out[focusedNode.ports.out.length - 1]);
    } else {
      await engine.port.add(focusedNode.id, { label: focusedNode.ports.out.length, platform: Constants.PlatformType.ALEXA });
    }

    onChange({ customPause: !hadPause }, false);
  }, [onChange, hadPause, engine.port, focusedNode.ports.out, focusedNode.id]);

  return (
    <Content
      footer={() => (
        <Controls
          tutorial={{ content: <HelpTooltip />, blockType: data.type, helpTitle: 'Need Help?', helpMessage: <HelpMessage /> }}
          {...(isAlexa && {
            menu: (
              <OverflowMenu options={[{ label: hadPause ? 'Remove Custom Pause' : 'Add Custom Pause', onClick: togglePause }]} placement="auto" />
            ),
          })}
        />
      )}
    >
      <Section>
        <FormControl>
          <label htmlFor="audio-url">Audio Url or Variable</label>
          <VariablesInput
            placeholder="AAC, MP4, MP3, HLS, PLS, M3U are supported"
            value={data.audio}
            onBlur={updateAudio}
            error={invalidAudio}
            id="audio-url"
          />
          {invalidAudio && <ErrorMessageWithDivider>This is an invalid URL</ErrorMessageWithDivider>}
        </FormControl>
        <Checkbox type="checkbox" checked={!!data.loop} onChange={toggleLoop}>
          <span>Loop audio</span>
        </Checkbox>
      </Section>

      <VisualsForm data={data} onChange={onChange} />
    </Content>
  );
}

const mapStateToProps = {
  focusedNode: Creator.focusedNodeSelector,
};

export default connect(mapStateToProps)(StreamEditor);
