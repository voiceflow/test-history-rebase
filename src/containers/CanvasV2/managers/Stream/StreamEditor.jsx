import React from 'react';
import Toggle from 'react-toggle';

import AudioDrop from '@/components/Uploads/AudioDrop';
import Image from '@/components/Uploads/Image';
import VariableInput from '@/components/VariableInput';
import { PlatformType } from '@/constants';
import { Content, Section } from '@/containers/CanvasV2/components/BlockEditor';
import { EngineContext } from '@/containers/CanvasV2/contexts';
import { focusedNodeSelector } from '@/ducks/creator';
import { activePlatformSelector } from '@/ducks/skill';
import { connect } from '@/hocs';

function StreamEditor({ data, focusedNode, platform, onChange }) {
  const engine = React.useContext(EngineContext);

  const isAlexa = platform === PlatformType.ALEXA;
  const updateAudio = (audio) => onChange({ audio });
  const updateTitle = (title) => onChange({ title });
  const updateDescription = (description) => onChange({ description });
  const updateIconImage = (iconImage) => onChange({ iconImage });
  const updateBackgroundImage = (backgroundImage) => onChange({ backgroundImage });
  const toggleLoop = () => onChange({ loop: !data.loop });

  const togglePause = () => {
    const hadPause = data.customPause;

    if (hadPause) {
      engine.port.remove(focusedNode.ports.out[focusedNode.ports.out.length - 1]);
    } else {
      engine.port.add(focusedNode.id, { label: focusedNode.ports.out.length, platform: PlatformType.ALEXA });
    }

    onChange({ customPause: !hadPause });
  };

  return (
    <Content>
      <Section>
        <label>Stream File (AAC/MP4, MP3, HLS)</label>
        <AudioDrop audio={data.audio} update={updateAudio} stream />
        <label>Title</label>
        <VariableInput className="form-control" value={data.title} placeholder="Insert audio stream title" onChange={updateTitle} />

        <label>Description</label>
        <VariableInput className="form-control" value={data.description} placeholder="Insert audio stream description" onChange={updateDescription} />

        <label>Icon</label>
        <Image url max_size={5 * 1024 * 1024} image={data.iconImage} update={updateIconImage} />

        <label>Background Image</label>
        <Image url max_size={5 * 4096 * 4096} image={data.backgroundImage} update={updateBackgroundImage} margin />
        {isAlexa && (
          <div className="space-between mt-3">
            <label>Custom Pause</label>
            <Toggle icons={false} checked={!!data.customPause} onChange={togglePause} className="fulfill-switch" />
          </div>
        )}
        {isAlexa && (
          <div className="space-between">
            <label>Loop Audio</label>
            <Toggle icons={false} checked={!!data.loop} onChange={toggleLoop} className="fulfill-switch" />
          </div>
        )}
      </Section>
    </Content>
  );
}

const mapStateToProps = {
  platform: activePlatformSelector,
  focusedNode: focusedNodeSelector,
};

export default connect(mapStateToProps)(StreamEditor);
