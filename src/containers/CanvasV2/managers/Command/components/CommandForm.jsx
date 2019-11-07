import React from 'react';

import Divider from '@/components/Divider';
import IntentSelect from '@/components/IntentSelect';
import SlotMappingManager from '@/components/SlotMappingManager';
import PlatformTooltip from '@/components/Tooltips/PlatformTooltip';
import FlowSelect from '@/containers/CanvasV2/components/FlowSelect';
import { intentByIDSelector } from '@/ducks/intent';
import { activePlatformSelector } from '@/ducks/skill';
import { connect } from '@/hocs';

function CommandForm({ platformData, slotIDs, onChange, platform }) {
  const updatePlatformData = React.useCallback((value) => onChange({ [platform]: { ...platformData, ...value } }), [
    platform,
    platformData,
    onChange,
  ]);
  const updateIntent = React.useCallback((intent) => updatePlatformData({ intent }), [updatePlatformData]);
  const updateMappings = React.useCallback((mappings) => updatePlatformData({ mappings }), [updatePlatformData]);

  return (
    <>
      <div className="d-flex justify-content-between">
        <label>Command Intent</label>
        <PlatformTooltip platform={platform} field="Intent handlers" />
      </div>
      <IntentSelect value={platformData.intent} onChange={updateIntent} />
      <Divider />
      <FlowSelect data={platformData} onChange={updatePlatformData} />
      {!!slotIDs.length && (
        <>
          <SlotMappingManager slotIDs={slotIDs} items={platformData.mappings} onChange={updateMappings} />
        </>
      )}
    </>
  );
}

const mapStateToProps = {
  platform: activePlatformSelector,
  slots: intentByIDSelector,
};

const mergeProps = ({ platform, slots: getIntentByID }, _, { data }) => {
  const platformData = data[platform];
  const selectedIntent = platformData.intent && getIntentByID(platformData.intent);

  return {
    platformData,
    slotIDs: selectedIntent ? selectedIntent.inputs.flatMap((input) => input.slots) : [],
  };
};

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(CommandForm);
