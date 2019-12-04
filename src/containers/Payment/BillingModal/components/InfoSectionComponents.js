import StepHeading from '@/containers/Payment/Checkout/components/StepHeading';
import { styled } from '@/hocs';

export const Heading = styled(StepHeading)`
  padding: 0;
`;

export const Container = styled.div`
  margin: 0 15px;
  padding: 15px 0;
  border-bottom: 1px solid #e0e7ee;
  &:first-child {
    padding-top: 0;
  }
  &:last-child {
    border-bottom: none;
  }
`;

export const Details = styled.div`
  padding: 10px 0;
`;

export const Date = styled.div`
  font-weight: 600;
`;

export const Amount = styled.div`
  font-size: 26px;
  font-weight: 600;
`;

export const Items = styled.div`
  font-size: 12px;
  color: #62778c;
`;

export const NothingText = styled.div`
  font-size: 12px;
  color: #62778c;
`;
