import SvgIcon from '@/components/SvgIcon';
import { styled } from '@/styles';

export const BubbleButton = styled.div`
  background: #2b2f32;
  border-radius: 16px;
  color: white;
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 12px 4px 8px;
  box-shadow: 0px 1px 3px rgb(43 47 50 / 16%);

  ${SvgIcon.Container} {
    opacity: 0.8;
  }

  :hover {
    ${SvgIcon.Container} {
      opacity: 1;
    }
  }
`;

export const BubbleIcon = styled(SvgIcon)`
  display: inline-block;
  margin-right: 4px;
`;
