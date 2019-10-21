import React from 'react';
import { Tooltip } from 'react-tippy';
import Toggle from 'react-toggle';

import Flex, { FlexApart } from '@/componentsV2/Flex';
import { addFulfillment, deleteFulfillment, fulfillmentSelector } from '@/ducks/skill';
import { connect } from '@/hocs';

function CanFulfillForm({ fulfillment, intentID, deleteFulfillment, addFulfillment }) {
  const toggleCanFulfill = () => {
    if (fulfillment) {
      deleteFulfillment(intentID);
    } else {
      addFulfillment(intentID);
    }
  };

  return (
    <FlexApart>
      <Flex>
        <Toggle icons={false} checked={!!fulfillment} onChange={toggleCanFulfill} />
        <div className="text-muted ml-2">Can Fulfill Intent</div>
      </Flex>
      <Tooltip
        title="Handle CanFulfillIntent Requests with this block. If your intent has slots, use Discovery in settings to specify which slots your skill is able to handle"
        position="bottom"
        className="text-muted pointer"
      >
        ?
      </Tooltip>
    </FlexApart>
  );
}

const mapStateToProps = {
  fulfillment: fulfillmentSelector,
};

const mapDispatchToProps = {
  deleteFulfillment,
  addFulfillment,
};

const mergeProps = ({ fulfillment: fulfillmentSelector }, _, { intentID }) => ({
  fulfillment: fulfillmentSelector(intentID),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(CanFulfillForm);
