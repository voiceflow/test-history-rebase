import { styled, transition } from '@/hocs';

export const SlotBubble = styled.div`
  ${transition('opacity')}
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
  opacity: 0.8;

  :hover {
    opacity: 1;
  }
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
`;
