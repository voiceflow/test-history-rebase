import Checkbox from '@/components/Checkbox';
import { styled, transition } from '@/hocs';

export const Container = styled.div`
  background-color: ${({ theme }) => theme.color.offWhite};
  padding: 14px;
  border: 1px solid ${({ active, color }) => (active ? color : '#ebf0f5')};
  margin-right: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
  padding-bottom: 30px;
  min-height: 180px;
  flex: 1;
  position: relative;

  ${transition()}

  &:last-child {
    margin-right: 0;
  }
  :hover {
    border: 1px solid ${({ color }) => color};
  }
`;

export const Description = styled.div`
  margin: 10px 0;
  margin-bottom: 0;
`;

export const Price = styled.span`
  font-weight: 600;
  margin-right: 4px;
  font-size: 15px;
`;

export const PriceDescription = styled.span`
  color: #8da2b5;
`;

export const PriceContainer = styled.div`
  position: absolute;
  bottom: 10px;
`;

export const SelectBox = styled(Checkbox)`
  position: absolute;
  top: 10px;
  right: 0px;
`;

export const EditorLimitText = styled.div`
  margin-top: 6px;
  color: #8da2b5;
`;
