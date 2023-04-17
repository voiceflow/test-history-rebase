import { Flex } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export { default as BillingDropdown } from './BillingDropdown';
export { default as Container } from './Container';
export { default as CostText } from './CostText';
export { default as InfoBubble } from './InfoBubble';
export { default as PaymentDetailsContainer } from './PaymentDetailsContainer';
export { default as SubHeader } from './SubHeader';

export const EditorSeatsText = styled.div`
  color: #132144;
`;

export const PeriodDropdownContainer = styled.div`
  color: #62778c;
  font-size: 13px;
`;
export const BubbleTextContainer = styled(Flex)`
  width: 130px;
  margin-left: 15px;
  align-items: start;
`;

export const PriceContainer = styled.div`
  margin-left: auto;
  color: rgba(19, 33, 68, 0.65);
`;

export const DollarSymbol = styled.span`
  position: relative;
  bottom: 17px;
  color: #62778c;
  font-size: 13px;
`;

export const PriceAmount = styled.span`
  font-size: 40px;
`;

export const CostTimeUnit = styled.span`
  color: #8da2b5;
  font-size: 13px;
`;
export const PaymentDetailsText = styled.span`
  color: #62778c;
  fontsize: 15px;
  font-weight: 600;
`;

export const CouponText = styled.span`
  font-size: 13px;
`;
