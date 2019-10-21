import React from 'react';

import Divider from '@/components/Divider';
import IntentSelect from '@/components/IntentSelect';
import SlotMappingManager from '@/components/SlotMappingManager';
import PlatformTooltip from '@/components/Tooltips/PlatformTooltip';
import { FlexApart } from '@/componentsV2/Flex';
import { PlatformType } from '@/constants';
import { intentByIDSelector } from '@/ducks/intent';
import { activePlatformSelector, isRootDiagramSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { ALEXA_BUILT_INS } from '@/utils/intent';

import CanFulfillForm from './CanFulfillForm';

const isCanFulfill = (intent) => intent && ALEXA_BUILT_INS.every(({ key }) => key !== intent);

function IntentForm({ data, slotIDs, onChange, platform, isRoot }) {
  const platformData = data[platform];
  const updatePlatformData = (value) => onChange({ [platform]: { ...platformData, ...value } });
  const updateIntent = (intent) => updatePlatformData({ intent });
  const updateMappings = (mappings) => updatePlatformData({ mappings });

  const validForCanFulfill = platform === PlatformType.ALEXA && isRoot && isCanFulfill(platformData.intent);

  return (
    <>
      <FlexApart as="label">
        Select Intent
        <PlatformTooltip platform={platform} field="Intent handlers" />
      </FlexApart>
      <IntentSelect value={platformData.intent} onChange={updateIntent} />
      {!!slotIDs.length && (
        <>
          <Divider />
          <SlotMappingManager slotIDs={slotIDs} items={platformData.mappings} onChange={updateMappings} />
        </>
      )}
      {validForCanFulfill && (
        <>
          <Divider />
          <CanFulfillForm intentID={platformData.intent} />
        </>
      )}
    </>
  );
}

const mapStateToProps = {
  platform: activePlatformSelector,
  slots: intentByIDSelector,
  isRoot: isRootDiagramSelector,
};

const mergeProps = ({ platform, slots: getIntentByID }, _, { data }) => {
  const selectedIntent = data[platform].intent && getIntentByID(data[platform].intent);

  return {
    slotIDs: selectedIntent ? selectedIntent.inputs.flatMap((input) => input.slots) : [],
  };
};

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(IntentForm);
