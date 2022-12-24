import { Divider, SvgIcon } from '@voiceflow/ui';

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

export const DividerBorder = styled(Divider)`
  margin: 0;
  background: #eaeff4;
`;

export const JumpToEntitiesBubble = styled.div`
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
