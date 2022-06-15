import { Nullable } from '@voiceflow/common';
import { PlanType } from '@voiceflow/internal';
import { Box, BoxFlexCenter, Button, ButtonVariant, PopperAPI, Portal, SvgIcon, Text, usePopper, VirtualElement } from '@voiceflow/ui';
import React from 'react';

import { LimitDetails } from '@/config/planLimits';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';
import { SvgShadow } from '@/pages/Conversations/components/GatedTranscripts/components';

import UpgradeContainer from './UpgradeContainer';

const UpgradePopper = React.forwardRef<
  PopperAPI<Nullable<Element | VirtualElement>, Nullable<HTMLElement>>,
  { planLimits?: LimitDetails | null; popperContainerRef?: React.Ref<HTMLDivElement> }
>(({ planLimits, popperContainerRef }, ref) => {
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

  return (
    <div ref={rootPopper.setReferenceElement}>
      <Portal portalNode={document.body}>
        <div ref={rootPopper.setPopperElement} style={rootPopper.styles.popper} {...rootPopper.attributes.popper}>
          <UpgradeContainer ref={popperContainerRef}>
            <BoxFlexCenter flexDirection="column">
              <SvgShadow>
                <SvgIcon icon="skillTemplate" size={80} />
              </SvgShadow>
              <Text fontWeight={600} color="black">
                {planLimits?.title}
              </Text>
            </BoxFlexCenter>
            <Box mt="8px" mb="20px" textAlign="center">
              <Text color="#62778c">{planLimits?.description}</Text>
            </Box>
            <BoxFlexCenter>
              <Button variant={ButtonVariant.PRIMARY} squareRadius onClick={() => planLimits?.onSubmit({ openPaymentModal })}>
                {planLimits?.submitText}
              </Button>
            </BoxFlexCenter>
          </UpgradeContainer>
        </div>
      </Portal>
    </div>
  );
});

export default UpgradePopper;
