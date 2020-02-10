import React from 'react';

import Checkbox from '@/components/Checkbox';
import OverflowMenu from '@/componentsV2/OverflowMenu';
import Section from '@/componentsV2/Section';
import VariablesInput from '@/componentsV2/VariablesInput';
import { HTTPS_URL_REGEX, PlatformType, SLOT_REGEXP } from '@/constants';
import { focusedNodeSelector } from '@/ducks/creator';
import { activePlatformSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { useEnableDisable } from '@/hooks';
import { Content, Controls, FormControl } from '@/pages/Canvas/components/Editor';
import { ErrorMessageWithDivider } from '@/pages/Canvas/components/ErrorMessage';
import { EngineContext } from '@/pages/Canvas/contexts';

import { HelpMessage, HelpTooltip, VisualsForm } from './components';

const isValidURL = (url) => url.match(HTTPS_URL_REGEX) || url.match(SLOT_REGEXP);

function StreamEditor({ data, focusedNode, platform, onChange }) {
  const [invalidAudio, setValidAudio, setInvalidAudio] = useEnableDisable(false);
  const engine = React.useContext(EngineContext);

  const hadPause = data.customPause;
  const isAlexa = platform === PlatformType.ALEXA;
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
    onChange({ customPause: !hadPause }, false);

    if (hadPause) {
      await engine.port.remove(focusedNode.ports.out[focusedNode.ports.out.length - 1]);
    } else {
      await engine.port.add(focusedNode.id, { label: focusedNode.ports.out.length, platform: PlatformType.ALEXA });
    }
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
      <Section isDividerNested>
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
  platform: activePlatformSelector,
  focusedNode: focusedNodeSelector,
};

export default connect(mapStateToProps)(StreamEditor);
