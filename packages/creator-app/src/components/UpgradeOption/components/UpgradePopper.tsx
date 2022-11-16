import { Nullable } from '@voiceflow/common';
import { PlanType } from '@voiceflow/internal';
import { Box, Button, ButtonVariant, PopperAPI, Portal, SvgIcon, Text, usePopper, VirtualElement } from '@voiceflow/ui';
import React from 'react';

import { LimitDetails, upgradeToEnterpriseAction } from '@/config/planLimits';
import { ModalType } from '@/constants';
import { UpgradePrompt } from '@/ducks/tracking';
import { useModals, useTrackingEvents } from '@/hooks';
import { SvgShadow } from '@/pages/Conversations/components/GatedTranscripts/components';

import UpgradeContainer from './UpgradeContainer';

const UpgradePopper = React.forwardRef<
  PopperAPI<Nullable<Element | VirtualElement>, Nullable<HTMLElement>>,
  { planLimits?: LimitDetails | null; popperContainerRef?: React.Ref<HTMLDivElement>; promptOrigin: UpgradePrompt }
>(({ planLimits, popperContainerRef, promptOrigin }, ref) => {
  const rootPopper = usePopper({
    modifiers: [
      { name: 'offset', options: { offset: [-22, 24] } },
      { name: 'preventOverflow', options: { boundary: document.body } },
    ],
    strategy: 'fixed',
    placement: 'right-start',
  });

  React.useImperativeHandle(ref, () => rootPopper, [rootPopper]);

  const { open: openPaymentModal } = useModals<{ planType: PlanType }>(ModalType.PAYMENT);
  const [trackingEvents] = useTrackingEvents();

  const handleOnClick = () => {
    if (planLimits?.onSubmit === upgradeToEnterpriseAction) {
      trackingEvents.trackContactSales({ promptType: promptOrigin });
    }
    planLimits?.onSubmit({ openPaymentModal });
  };

  return (
    <div ref={rootPopper.setReferenceElement}>
      <Portal portalNode={document.body}>
        <div ref={rootPopper.setPopperElement} style={rootPopper.styles.popper} {...rootPopper.attributes.popper}>
          <UpgradeContainer ref={popperContainerRef}>
            <Box.FlexCenter flexDirection="column">
              <SvgShadow>
                <SvgIcon icon="skillTemplate" size={80} />
              </SvgShadow>
              <Text fontWeight={600} color="black">
                {planLimits?.title}
              </Text>
            </Box.FlexCenter>
            <Box mt="8px" mb="20px" textAlign="center">
              <Text color="#62778c">{planLimits?.description}</Text>
            </Box>
            <Box.FlexCenter>
              <Button variant={ButtonVariant.PRIMARY} onClick={handleOnClick}>
                {planLimits?.submitText}
              </Button>
            </Box.FlexCenter>
          </UpgradeContainer>
        </div>
      </Portal>
    </div>
  );
});

export default UpgradePopper;
