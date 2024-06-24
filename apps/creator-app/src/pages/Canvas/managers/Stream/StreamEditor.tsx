import { BaseModels } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { ErrorMessageWithDivider } from '@voiceflow/ui';
import React from 'react';

import Checkbox from '@/components/legacy/Checkbox';
import OverflowMenu from '@/components/OverflowMenu';
import Section from '@/components/Section';
import VariablesInput from '@/components/VariablesInput';
import * as History from '@/ducks/history';
import { useActiveProjectPlatform, useDispatch, useEnableDisable } from '@/hooks';
import { Content, Controls, FormControl } from '@/pages/Canvas/components/Editor';
import { NodeEditor } from '@/pages/Canvas/managers/types';
import { containsVariable, isHTTPsURL } from '@/utils/string.util';

import { HelpMessage, HelpTooltip, VisualsForm } from './components';

const isValidURL = (url: string): boolean => isHTTPsURL(url) || containsVariable(url);

const StreamEditor: NodeEditor<Realtime.NodeData.Stream, Realtime.NodeData.StreamBuiltInPorts> = ({
  data,
  node,
  engine,
  onChange,
}) => {
  const platform = useActiveProjectPlatform();

  const [invalidAudio, setValidAudio, setInvalidAudio] = useEnableDisable(false);

  const transaction = useDispatch(History.transaction);

  const hasPause = data.customPause;
  const isAlexa = platform === Platform.Constants.PlatformType.ALEXA;
  const toggleLoop = React.useCallback(() => onChange({ loop: !data.loop }), [data.loop, onChange]);

  const updateAudio = React.useCallback(
    ({ text }: { text: string }) => {
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
    const pausePortID = node.ports.out.builtIn[BaseModels.PortType.PAUSE];

    const hasPausePort = hasPause && !!pausePortID;

    await transaction(async () => {
      if (hasPausePort) {
        await engine.port.removeBuiltin(pausePortID);
      } else {
        await engine.port.addBuiltin(node.id, BaseModels.PortType.PAUSE);
      }

      await onChange({ customPause: !hasPausePort });
    });
  }, [onChange, hasPause, engine, node.id, node.ports.out.builtIn]);

  return (
    <Content
      footer={() => (
        <Controls
          tutorial={{
            content: <HelpTooltip />,
            blockType: data.type,
            helpTitle: 'Need Help?',
            helpMessage: <HelpMessage />,
          }}
          {...(isAlexa && {
            menu: (
              <OverflowMenu
                options={[{ label: hasPause ? 'Remove Custom Pause' : 'Add Custom Pause', onClick: togglePause }]}
                placement="auto"
              />
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

        <Checkbox checked={!!data.loop} onChange={toggleLoop}>
          <span>Loop audio</span>
        </Checkbox>
      </Section>

      <VisualsForm data={data} onChange={onChange} />
    </Content>
  );
};

export default StreamEditor;
