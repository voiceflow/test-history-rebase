import React from 'react';
import { Alert, Collapse } from 'reactstrap';

import Button from '@/components/Button';
import Divider from '@/components/Divider';
import IntentSelect from '@/components/IntentSelect';
import SlotMappingManager from '@/components/SlotMappingManager';
import { FlexApart } from '@/componentsV2/Flex';
import { allSlotsByIntentIDSelector } from '@/ducks/intent';
import { isLiveSelector } from '@/ducks/skill';
import { connect } from '@/hocs';

const InteractionChoice = ({ choice, slots, index, onRemove, onUpdate, toggleOpen, isLive }) => {
  const updateSelected = React.useCallback((selected) => onUpdate({ selected }), [onUpdate]);
  const updateMappings = React.useCallback((mappings) => onUpdate({ mappings }), [onUpdate]);

  return (
    <>
      <FlexApart>
        <span onClick={toggleOpen}>
          {choice.open ? <i className="fas fa-caret-down" /> : <i className="fas fa-caret-right" />} {index + 1}
        </span>
        <Button isClose onClick={onRemove} disabled={isLive} />
      </FlexApart>
      {choice.invalid && (
        <Alert color="danger" className="mt-2 mb-1 py-1 text-center">
          <i className="fas fa-exclamation-square" /> This intent doesn't exist
        </Alert>
      )}
      <Collapse isOpen={choice.open}>
        <div className="super-center flex-hard choice-select mt-2">
          <IntentSelect className="flex-hard" value={choice.selected} onChange={updateSelected} />
        </div>
        {!!slots.length && (
          <>
            <Divider />
            <SlotMappingManager slotIDs={slots} items={choice.mappings} onChange={updateMappings} />
          </>
        )}
      </Collapse>
    </>
  );
};

const mapStateToProps = {
  slots: allSlotsByIntentIDSelector,
  isLive: isLiveSelector,
};

const mergeProps = ({ slots: getSlotsByIntentID }, _, { choice }) => ({
  slots: choice.selected ? getSlotsByIntentID(choice.selected) : [],
});

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(InteractionChoice);
