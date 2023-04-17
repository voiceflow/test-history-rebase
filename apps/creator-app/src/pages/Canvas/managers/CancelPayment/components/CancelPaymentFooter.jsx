import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import { Controls } from '@/pages/Canvas/components/Editor';

import HelpTooltipContent from './HelpTooltipContent';

const CancelPaymentFooter = ({ updateProduct, withMenu = false, blockType }) => (
  <Controls
    menu={withMenu && <OverflowMenu options={[{ onClick: updateProduct({ productID: null }), label: 'Unlink Product' }]} placement="top-end" />}
    tutorial={{
      blockType,
      content: <HelpTooltipContent />,
    }}
    anchor="More Info"
    helpMessage="read more about cancelling in skill purchases here"
  />
);

export default CancelPaymentFooter;
