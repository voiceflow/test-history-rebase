import cn from 'classnames';
import React from 'react';

import SlotSelect from '@/components/SlotSelect';
import VariableSelect from '@/componentsV2/VariableSelect';
import { CUSTOM_SLOT_TYPE, PlatformType } from '@/constants';
import { Content, Section } from '@/containers/CanvasV2/components/BlockEditor';
import SlotSynonymManager from '@/containers/SlotManager/components/SlotSynonymManager';
import { activePlatformSelector, isLiveSelector } from '@/ducks/skill';
import { connect } from '@/hocs';

function CaptureEditor({ data, onChange, platform, isLive }) {
  const onSelectVariable = (variable) => onChange({ variable });
  const updateSlot = (slot) => onChange({ slot });
  const updateExamples = (examples) => onChange({ examples });

  return (
    <Content>
      {platform === PlatformType.ALEXA && (
        <Section className={cn({ 'disabled-overlay': isLive })}>
          <label>
            Input Type <small className="text-dull ml-1">required</small>
          </label>
          <SlotSelect value={data.slot} onChange={updateSlot} />
          {data.slot === CUSTOM_SLOT_TYPE && <SlotSynonymManager items={data.examples} onChange={updateExamples} />}
        </Section>
      )}
      <Section>
        <label>Capture Input to</label>
        <VariableSelect value={data.variable} onChange={onSelectVariable} />
      </Section>
    </Content>
  );
}

const mapStateToProps = {
  platform: activePlatformSelector,
  isLive: isLiveSelector,
};

export default connect(mapStateToProps)(CaptureEditor);
