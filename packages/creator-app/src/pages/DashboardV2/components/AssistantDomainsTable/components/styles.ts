import { Link, SvgIcon } from '@voiceflow/ui';

import { styled, transition } from '@/hocs';

export const SelectWrapper = styled.div`
  margin-left: 12px;
  cursor: pointer;
`;

export const Option = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;
export const Label = styled.div``;
export const Count = styled.div`
  color: #8da2b5;
`;

export const DomainRow = styled(Link)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: block;
  width: 100%;
`;

export const TopicRow = styled(Link)`
  width: 100%;
  text-align: right;
  padding-right: 10px;
`;

export const StyledSVG = styled(SvgIcon)`
  ${transition('opacity')}

  opacity: 0;
  display: inline-block;
  transform: rotate(90deg);
  margin-left: 8px;
  margin-top: 2px;
`;

export const StatusRow = styled.span`
  ${transition('color')}
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  &:hover {
    color: #3d82e2;

    ${StyledSVG} {
      opacity: 1;
    }
  }
`;

export const ActionRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-right: 10px;
`;
