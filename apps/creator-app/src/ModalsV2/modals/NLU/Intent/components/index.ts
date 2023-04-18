import { SvgIcon } from '@voiceflow/ui';

import { styled, transition } from '@/hocs/styled';

export const SlotBubble = styled.div`
  ${transition('opacity', 'border')}
  border-radius: 6px;
  border: solid 1px #eaeff4;
  padding: 3px 8px 3px 4px;
  background: white;
  font-size: 13px;
  color: #62778c;
  margin-right: 10px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  margin-bottom: 4px;

  ${SvgIcon.Container} {
    opacity: 0.8;
  }

  :hover {
    ${SvgIcon.Container} {
      opacity: 1;
    }

    border: solid 1px #dfe3ed;
  }
`;
